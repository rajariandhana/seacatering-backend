import { Request, Response, NextFunction } from "express";
import { getUserData, IUserToken } from "../utils/jwt";

export interface IReqUser extends Request {
    user?: IUserToken;
}

export default (req:Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if(!authorization) {
        return res.status(403).json({
            message: "unauthorized1",
            data: null
        });
    }

    const [prefix, accessToken] = authorization.split(" ");
    // if (!(prefix==="Bearer" && accessToken)){
    //     return res.status(403).json({
    //         message: "unauthorized2",
    //         data: null
    //     });
    // }
    if (!(prefix==="Bearer")){
        return res.status(403).json({
            message: "unauthorized2",
            data: null
        });
    }
    if (!(accessToken)){
        return res.status(403).json({
            message: "unauthorized23",
            data: null
        });
    }

    const user = getUserData(accessToken);
    if (!user){
        return res.status(403).json({
            message: "unauthorized3",
            data: null
        });
    }

    (req as IReqUser).user = user;
    next();
};