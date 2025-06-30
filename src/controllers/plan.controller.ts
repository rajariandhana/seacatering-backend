import { Request, Response } from "express";
import * as Yup from "yup";
import PlanModel, { Plan } from "../models/plan.model";
import UserModel from "../models/user.model";
import SubscriptionModel from "../models/subscription.model";

export interface PlanForm {
  name: string;
  price: number;
  description?: string;
  calories?: string;
  suitableFor?: string;
  highlights?: string[];
}

const planValidateSchema=Yup.object({
  name:Yup.string().required(),
  price:Yup.number().positive().integer().required(),
  description:Yup.string().optional(),
  calories:Yup.string().optional(),
  suitableFor:Yup.string().optional(),
  highlights: Yup.array().of(Yup.string()).optional(),
})

export default {
  async index(req: Request, res: Response) {
    try {
      const plans = await PlanModel.find();
      res.status(200).json(plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ message: "Failed to retrieve plans" });
    }
  },
  
  async create(req: Request, res: Response) {
    // console.log("create");
    const {name,price,description,calories,suitableFor,highlights} = req.body as unknown as PlanForm;
    try {
      await planValidateSchema.validate({
        name,price,description,calories,suitableFor,highlights
      })
      const result = await PlanModel.create({
        name,price,description,calories,suitableFor,highlights
      });
      res.status(200).json({
        message:'Plan created!',
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

  async show(req:Request, res:Response){
    const name = req.query.name;
    try {
      const plan = await PlanModel.findOne({name:name});
      res.status(200).json(plan);
    } catch (error) {
      console.error("Error fetching plan:", error);
      res.status(500).json({ message: "Failed to retrieve plan" });
    }
  },

  async update(req: Request, res: Response) {
    // ,calories,suitableFor,highlights -> edit later?
    const {name,price,description} = req.body as unknown as PlanForm;
    const { oldPlanName } = req.query as { oldPlanName: string };
    // console.log(req.body, req.query)
    try {
      await planValidateSchema.validate({
        name,price,description
      })
      const updatedPlan = await PlanModel.findOneAndUpdate(
        { name: oldPlanName },
        { name, price, description },
        { new: true }
      );

      if (!updatedPlan) {
        return res.status(404).json({
          message: "Plan not found",
          data: null,
        });
      }

      const subUpdateResult = await SubscriptionModel.updateMany(
        { planName: oldPlanName },
        { $set: { planName: name } }
      );

      res.status(200).json({
        message: `Plan updated! ${subUpdateResult.modifiedCount} subscription(s) updated.`,
        data: updatedPlan,
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
          message: err.message,
          data: null
      })
    }
  },

  async delete(req:Request, res:Response){
    // must unsubscribe all members with plan
    const planName = req.query.planName;
    try {
      const deletedPlan = await PlanModel.findOneAndDelete({name:planName});
      if (!deletedPlan) {
        return res.status(404).json({ message: "Plan not found" });
      }
      // const affectedSubscriptions = await SubscriptionModel.find({ planName });

      // await SubscriptionModel.updateMany(
      //   { planName },
      //   {
      //     $set: {
      //       planName: "",
      //       mealType: [],
      //       deliveryDays: [],
      //       totalPrice: 0,
      //       paused: true,
      //     },
      //     $unset: {
      //       allergies: "",
      //       notes: "",
      //     },
      //   }
      // );
      await SubscriptionModel.deleteMany({ planName });
      res.status(200).json(deletedPlan);
    } catch (error) {
      console.error("Error deleting plan:", error);
      res.status(500).json({ message: "Failed to delete plan" });
    }
  },
};

/**


 */
const basicPlans:PlanForm[]=[
  {
    "name": "Diet",
    "price": 30000,
    "description": "A light and balanced option designed to support weight management and healthy eating habits. Ideal for those watching their calorie intake without compromising on taste.",
    "calories":"350 - 400",
    "suitableFor":"Dieters, health-conscious individuals",
    "highlights":["calorie-controlled", "low-fat", "high-fiber"]
  },
  {
    "name": "Protein",
    "price": 40000,
    "description": "Perfect for active individuals and fitness enthusiasts, this plan is packed with high-quality protein sources to help build and maintain muscle.",
    "calories":"650 - 800",
    "suitableFor":"Athletes, bodybuilders",
    "highlights":["high-protein", "energy-dense", "performance-focused"]
  },
  {
    "name": "Royal",
    "price": 60000,
    "description": "Our premium offering featuring gourmet-style meals made with top-tier ingredients. Great for those who want the healthiest, tastiest, and most luxurious meal experience.",
    "calories": "800 - 1000",
    "suitableFor": "Food connoisseurs, luxury diners, individuals seeking a refined eating experience",
    "highlights": ["gourmet-quality", "luxury ingredients", "decadent flavors", "nutrient-rich"]
  }
];