import { User } from "../models/user.model";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { SECRET } from "./env";

// extend from class user but without all required properties
export interface IUserToken extends Omit<User,"password"|"email"|"fullName">{
    id?: Types.ObjectId;
}

export const generateToken = (user: IUserToken): string => {
    const token = jwt.sign(user, SECRET, {
        expiresIn: "1h"
    });
    return token;
};

export const getUserData = (token: string) => {
    const user = jwt.verify(token, SECRET) as IUserToken;
    return user;
};