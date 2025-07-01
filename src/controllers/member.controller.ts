import { Request, Response } from "express";
import UserModel from "../models/user.model";
import { ROLES } from "../utils/constant";
import { IReqUser } from "../middleware/auth.middleware";

export default {
  async index(req: Request, res: Response) {
    try {
      const members = await UserModel.find({role:ROLES.MEMBER}).populate("subscriptionId");
        res.status(200).json({
            message:"Success get members with subscriptions",
            data: members
      });
    } catch (error) {
      const err = error as unknown as Error;
        res.status(400).json({
            message: err.message,
            data: null
      })
    }
  },
  async subscription(req:IReqUser, res:Response){
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: 'Unauthorized. User ID not found.' });
    }

    const user = await UserModel.findById(userId).populate('subscriptionId');
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }
    if (user.role !== ROLES.MEMBER) {
      return res.status(403).json({ message: 'Only members can have subscription.' });
    }
    if (!user.subscriptionId) {
        return res.status(200).json({
            message: 'User has no subscription yet.',
            data: null,
        });
    }

    // const subscription = user.subscriptionId as unknown as Subscription;
    // const plan = await PlanModel.findOne({key: subscription.planName});

    res.status(200).json({
        message: "User's subscription found.",
        data: user.subscriptionId,
    });
  }
};