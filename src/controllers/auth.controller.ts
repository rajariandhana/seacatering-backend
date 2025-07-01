import { Request, Response } from "express";
import * as Yup from "yup";

import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";

import {IReqUser} from "../middleware/auth.middleware";

type TRegister = {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type TLogin = {
    email: string;
    password: string;
};

const registerValidateSchema = Yup.object({
    fullName: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string()
        .required()
        .min(8, "Password must be at least 8 characters")
        .test(
            "at-least-one-uppercase-letter",
            "Password must contain at least one uppercase letter",
            (value) => {
                if (!value) return false;
                return /[A-Z]/.test(value);
            }
        )
        .test(
            "at-least-one-number",
            "Password must contain at least one number",
            (value) => {
                if (!value) return false;
                return /\d/.test(value);
            }
        )
        .test(
            "at-least-one-special-char",
            "Password must contain at least one special character",
            (value) => {
                if (!value) return false;
                return /[!@#$%^&*(),.?":{}|<>]/.test(value);
            }
        ),
    confirmPassword: Yup.string()
        .required()
        .oneOf([Yup.ref("password"), ""], "Passwords do not match"),
});


export default {
    async register(req: Request, res: Response) {
        const {fullName, email, password, confirmPassword} = req.body as unknown as TRegister;
        try {
            await registerValidateSchema.validate({
                fullName, email, password, confirmPassword
            });

            const result = await UserModel.create({
                fullName, email, password
            });

            res.status(200).json({
                message:'Success registration!',
                data: result
            })

        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
                data: null
            })
        }
    },

    async login(req: Request, res: Response) {
        // console.log("HEREERERE 1");
        const {email, password} = req.body as unknown as TLogin;
        try {
            const userByEmail = await UserModel.findOne({
                email:email
            });
            if(!userByEmail){
                return res.status(403).json({
                    message:"User not found",
                    data: null
                });
            }
            // console.log("HEREERERE 2");

            // validate hashed password match with db password
            const validatePassword: boolean = encrypt(password) === userByEmail.password;
            if(!validatePassword) {
                return res.status(403).json({
                    message:"Incorrect password",
                    data: null
                });
            }
            // console.log("HEREERERE 3");

            const token = generateToken({
                id: userByEmail._id,
                role: userByEmail.role,
            });
            // console.log("HEREERERE 4");
            
            res.status(200).json({
                message: "Login success",
                data: token
            })

        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
                data: null
            })
        }
    },

    async me(req: IReqUser, res: Response) {
        try {
            const user = req.user;
            const result = await UserModel.findById(user?.id);
            // console.log("hehe");

            res.status(200).json({
                message:"Success get user profile",
                data: result
            });
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({
                message: err.message,
                data: null
            })
        }
    },

    async update(req: IReqUser, res: Response) {
        const { fullName, email, password, confirmPassword } = req.body;
        const updates: any = {};
        const userId = req.user?.id;

        try {
            // Build dynamic schema
            const dynamicSchemaShape: Record<string, Yup.AnySchema> = {};

            if (fullName !== undefined) {
                dynamicSchemaShape.fullName = Yup.string().required("Full name is required");
                updates.fullName = fullName;
            }

            if (email !== undefined) {
                dynamicSchemaShape.email = Yup.string()
                    .email("Invalid email")
                    .required("Email is required");

                // Check if email is taken by another user
                const existingUser = await UserModel.findOne({ email });
                if (existingUser && existingUser._id !== userId) {
                    return res.status(400).json({
                    message: "Email is already in use",
                    data: null,
                    });
                }

                updates.email = email;
            }

            if (password !== undefined || confirmPassword !== undefined) {
                dynamicSchemaShape.password = Yup.string()
                    .required("Password is required")
                    .min(8, "Password must be at least 8 characters")
                    .matches(/[A-Z]/, "Must contain an uppercase letter")
                    .matches(/\d/, "Must contain a number")
                    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must contain a special character");

                dynamicSchemaShape.confirmPassword = Yup.string()
                    .required("Confirm password is required")
                    .oneOf([Yup.ref("password"), ""], "Passwords do not match");

                updates.password = encrypt(password); // Encrypt only if password is being updated
            }

            const dynamicSchema = Yup.object().shape(dynamicSchemaShape);

            // Validate only the fields being updated
            await dynamicSchema.validate(req.body, { abortEarly: false });

            const result = await UserModel.findByIdAndUpdate(userId, updates, { new: true });

            return res.status(200).json({
                message: "User updated successfully",
                data: result,
            });
        } catch (error: any) {
            if (error.name === "ValidationError") {
                const fieldErrors: Record<string, string> = {};

                error.inner.forEach((err: any) => {
                if (err.path) {
                    fieldErrors[err.path] = err.message;
                }
                });

                return res.status(400).json({
                message: "Validation failed",
                errors: fieldErrors, // structured by field
                });
            }

            // Fallback for other types of errors
            return res.status(400).json({
                message: error.message || "Update failed",
                errors: null,
            });
        }
    }
};