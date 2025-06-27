import { Request, Response } from "express";
import * as Yup from "yup";

import SubscriptionModel from "../models/subscription.model";

type SubscriptionForm = {
  name:string;
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
  name:Yup.string().required(),
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
  async subscribe(req:Request, res:Response){
    const {name,phoneNumber,planKey,mealType,deliveryDays,allergies,notes} = req.body as unknown as SubscriptionForm;
    try {
      // console.log(name,phoneNumber,planKey,mealType,deliveryDays,allergies,notes);
      await subscriptionValidateSchema.validate({
        name,phoneNumber,planKey,mealType,deliveryDays,allergies,notes
      })

      const plan = plans.find(p=>p.key===planKey);
      if(!plan){
        return res.status(400).json({ error: 'Invalid planKey' });
      }
      const totalPrice = plan.price * mealType.length * deliveryDays.length * 4.3;

      const result = await SubscriptionModel.create({
        name,phoneNumber,planKey,mealType,deliveryDays,allergies,notes, totalPrice
      });
      // console.log("You have subscribed!")
      res.status(200).json({
        message:'You have subscribed!',
        data: result
      })
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
          message: err.message,
          data: null
      })
    }
  }
}