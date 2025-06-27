import { Request, Response } from "express";
import * as Yup from "yup";
import PlanModel from "../models/plan.model";

export interface PlanForm {
  key: string;
  name: string;
  price: number;
  description?: string;
  calories?: string;
  suitableFor?: string;
  highlights?: string[];
}

const planValidateSchema=Yup.object({
  key:Yup.string().required(),
  name:Yup.string().required(),
  price:Yup.number().positive().integer().required(),
  description:Yup.string().optional(),
  calories:Yup.string().optional(),
  suitableFor:Yup.string().optional(),
  highlights: Yup.array().of(Yup.string()).optional(),
})

export default {
  async findAll(req: Request, res: Response) {
    try {
      const plans = await PlanModel.find();
      res.status(200).json(plans);
    } catch (error) {
      console.error("Error fetching plans:", error);
      res.status(500).json({ message: "Failed to retrieve plans" });
    }
  },
  
  async create(req: Request, res: Response) {
    const {key,name,price,description,calories,suitableFor,highlights} = req.body as unknown as PlanForm;
    try {
      await planValidateSchema.validate({
        key,name,price,description,calories,suitableFor,highlights
      })
      const result = await PlanModel.create({
        key,name,price,description,calories,suitableFor,highlights
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
  }
};

/**


 */
const basicPlans:PlanForm[]=[
  {
    "key": "diet",
    "name": "Diet",
    "price": 30000,
    "description": "A light and balanced option designed to support weight management and healthy eating habits. Ideal for those watching their calorie intake without compromising on taste.",
    "calories":"350 - 400",
    "suitableFor":"Dieters, health-conscious individuals",
    "highlights":["calorie-controlled", "low-fat", "high-fiber"]
  },
  {
    "key": "protein",
    "name": "Protein",
    "price": 40000,
    "description": "Perfect for active individuals and fitness enthusiasts, this plan is packed with high-quality protein sources to help build and maintain muscle.",
    "calories":"650 - 800",
    "suitableFor":"Athletes, bodybuilders",
    "highlights":["high-protein", "energy-dense", "performance-focused"]
  },
  {
    "key": "royal",
    "name": "Royal",
    "price": 60000,
    "description": "Our premium offering featuring gourmet-style meals made with top-tier ingredients. Great for those who want the healthiest, tastiest, and most luxurious meal experience.",
    "calories": "800 - 1000",
    "suitableFor": "Food connoisseurs, luxury diners, individuals seeking a refined eating experience",
    "highlights": ["gourmet-quality", "luxury ingredients", "decadent flavors", "nutrient-rich"]
  }
];