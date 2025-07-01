import { Request, Response } from "express";
import * as Yup from "yup";
import SubscriptionModel, { Subscription } from "../models/subscription.model";
import { IReqUser } from "../middleware/auth.middleware";
import UserModel from "../models/user.model";
import { ROLES } from "../utils/constant";
import PlanModel from "../models/plan.model";

type SubscriptionForm = {
  phoneNumber:string;
  planName:string;
  mealType:string[];
  deliveryDays:string[];
  allergies?:string;
  notes?:string;
  pauseStart:Date|null;
  pauseEnd:Date|null;
}

const mealType = [
  'Breakfast','Lunch','Dinner'
];

const validWeekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const subscriptionValidateSchema=Yup.object({
  phoneNumber:Yup.string().matches(/^\d+$/).required(),
  planName:Yup.string().required(),
  mealType: Yup.array().of(Yup.string().oneOf(mealType, 'Invalid meal type')).min(1).max(3).required(),
  deliveryDays: Yup.array().of(Yup.string().oneOf(validWeekdays, 'Invalid day')).min(1).max(7).required(),
  allergies:Yup.string().optional(),
  notes:Yup.string().optional(),
  pauseStart: Yup.date().nullable().notRequired(),
  pauseEnd: Yup.date().nullable().notRequired()
})

export default {
  async index(req: Request, res: Response) {
    try {
        const subscriptions = await SubscriptionModel.find();
        res.status(200).json({
            message:"Success get all subscriptions",
            data: subscriptions
        });
    } catch (error) {
        const err = error as unknown as Error;
        res.status(400).json({
            message: err.message,
            data: null
        })
    }
  },

  async create(req:IReqUser, res:Response){
    console.log(req.body)
    const {phoneNumber,planName,mealType,deliveryDays,allergies,notes,pauseStart,pauseEnd} = req.body as unknown as SubscriptionForm;
    // console.log(req.body as unknown as SubscriptionForm)
    try {
      // console.log(phoneNumber,planName,mealType,deliveryDays,allergies,notes);
      await subscriptionValidateSchema.validate({
        phoneNumber,planName,mealType,deliveryDays,allergies,notes,pauseStart,pauseEnd
      })

      const plan = await PlanModel.findOne({name:planName});
      if(!plan){
        return res.status(400).json({ error: 'Invalid planName' });
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
        userId, phoneNumber,planName,mealType,deliveryDays,allergies,notes, totalPrice,pauseStart,pauseEnd
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
      console.log(err.message)
      res.status(400).json({
          message: err.message,
          data: null
      })
    }
  },

  async show(req:IReqUser, res:Response){
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
  },

  async pause(req:IReqUser, res:Response){
    const {pauseStart, pauseEnd} = req.body;
    // console.log(pauseStart,pauseEnd)
    // return res.status(200).json();
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

    const startDate = new Date(pauseStart);
    const endDate = new Date(pauseEnd);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format.' });
    }

    if (startDate >= endDate) {
      return res.status(400).json({ message: 'Start date cannot be after or equal to end date.' });
    }

    subscription.pauseStart = pauseStart;
    subscription.pauseEnd = pauseEnd;
    await subscription.save();
    // console.log("Set pause dates")c
    return res.status(200).json({
      message: "Pause date are set",
      data: subscription,
    });
  },

  async delete(req: IReqUser, res: Response) {
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