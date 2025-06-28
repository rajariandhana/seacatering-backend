import { Request, Response } from "express";
import * as Yup from "yup";
import SubscriptionModel from "../models/subscription.model";
import { IReqUser } from "../middleware/auth.middleware";
import UserModel from "../models/user.model";
import { ROLES } from "../utils/constant";

type SubscriptionForm = {
  phoneNumber:string;
  planKey:string;
  mealType:string[];
  deliveryDays:string[];
  allergies?:string;
  notes?:string;
}

const mealType = [
  'breakfast','lunch','dinner'
];

const validWeekdays = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const subscriptionValidateSchema=Yup.object({
  phoneNumber:Yup.string().matches(/^\d+$/).required(),
  planKey:Yup.string().required(),
  mealType: Yup.array().of(Yup.string().oneOf(mealType, 'Invalid meal type')).min(1).max(3).required(),
  deliveryDays: Yup.array().of(Yup.string().oneOf(validWeekdays, 'Invalid day')).min(1).max(7).required(),
  allergies:Yup.string().optional(),
  notes:Yup.string().optional()
})

const plans=[
  {
    key: 'diet',
    price: 30000,
  },
  {
    key: 'protein',
    price: 40000,
  },
  {
    key: 'royal',
    price: 60000,
  }
];

export default {
  async subscribe(req:IReqUser, res:Response){
    const {phoneNumber,planKey,mealType,deliveryDays,allergies,notes} = req.body as unknown as SubscriptionForm;
    try {
      // console.log(phoneNumber,planKey,mealType,deliveryDays,allergies,notes);
      await subscriptionValidateSchema.validate({
        phoneNumber,planKey,mealType,deliveryDays,allergies,notes
      })

      const plan = plans.find(p=>p.key===planKey);
      if(!plan){
        return res.status(400).json({ error: 'Invalid planKey' });
      }
      const totalPrice = plan.price * mealType.length * deliveryDays.length * 4.3;

      // console.log(req.user);
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized. User ID not found.' });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      if(user.subscriptionId){
        await SubscriptionModel.findByIdAndDelete(user.subscriptionId);
      }

      if (user.role !== ROLES.MEMBER) {
        return res.status(403).json({ message: 'Only members can subscribe.' });
      }

      const subscription = await SubscriptionModel.create({
        userId, phoneNumber,planKey,mealType,deliveryDays,allergies,notes, totalPrice
      });

      await UserModel.findByIdAndUpdate(userId,{
        subscriptionId: subscription._id
      })
      
      // console.log("You have subscribed!")
      res.status(200).json({
        message:'You have subscribed!',
        data: subscription
      })
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
          message: err.message,
          data: null
      })
    }
  },

  async memberSubscription(req:IReqUser, res:Response){
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

    res.status(200).json({
        message: "User's subscription found.",
        data: user.subscriptionId,
    });
  },

  async togglePause(req:IReqUser, res:Response){
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

    const subscription = await SubscriptionModel.findById(user.subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found." });
    }

    subscription.paused = !subscription.paused;
    await subscription.save();

    return res.status(200).json({
      message: `Subscription is now ${subscription.paused ? "paused" : "active"}.`,
      data: subscription,
    });
  },

  async unsubscribe(req: IReqUser, res: Response) {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. User ID not found." });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!user.subscriptionId) {
      return res.status(400).json({ message: "User has no active subscription to delete." });
    }

    try {
      await SubscriptionModel.findByIdAndDelete(user.subscriptionId);

      user.subscriptionId = undefined;
      await user.save();

      res.status(200).json({
        message: "Subscription deleted successfully.",
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete subscription.",
        error: (error as Error).message,
      });
    }
  }

}