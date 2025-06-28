import mongoose, { Types } from "mongoose";
import { encrypt } from "../utils/encryption";
import { ROLES } from "../utils/constant";

export interface User {
    fullName: string;
    email: string;
    password: string;
    role: string;
    subscriptionId?:Types.ObjectId;
    createdAt?: string;
}
const Schema = mongoose.Schema;
const UserSchema = new Schema<User>({
    fullName: {
        type: Schema.Types.String,
        required: true,
    },
    email: {
        type: Schema.Types.String,
        required: true,
        unique:true,
    },
    password: {
        type: Schema.Types.String,
        required: true,
    },
    role: {
        type: Schema.Types.String,
        enum: [ROLES.ADMIN,ROLES.MEMBER],
        default: ROLES.MEMBER,
    },
    subscriptionId:{
        type: Schema.Types.ObjectId,
        ref:"Subscription",
        unique:true,
        sparse:true,
    }
},{
    timestamps: true,
});

UserSchema.pre("save", function (next) {
    const user = this;
    user.password = encrypt(user.password);
    next();
});

UserSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
}

// "User" will be the table
const UserModel = mongoose.model("User", UserSchema);
export default UserModel;