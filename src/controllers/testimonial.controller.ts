import { Request, Response } from "express";
import * as Yup from "yup";

import TestimonialModel from "../models/testimonial.model";

type TestimonialForm = {
  name:string;
  message:string;
  star:number;
}

const testimonialValidateSchema =Yup.object({
  name:Yup.string().required(),
  message:Yup.string().required(),
  star: Yup.number().required().min(1).max(5),
})

export default {
  async index(req: Request, res: Response) {
    try {
      const testimonials = await TestimonialModel.find();
      res.status(200).json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to retrieve testimonials" });
    }
  },

  async create(req:Request, res:Response){
    const {name, message, star} = req.body as unknown as TestimonialForm;
    try {
      await testimonialValidateSchema.validate({
        name, message, star
      });

      const result = await TestimonialModel.create({
        name, message, star
      });
      res.status(200).json({
        message:'Thanks for your feedback!',
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

const tempTestimonials:TestimonialForm[]=[
  {
    "name":"Amanda P.",
    "message":"SEA Catering has completely changed the way I eat. The meals are always fresh, flavorful, and I love being able to customize based on my diet. Highly recommend!",
    "star":5,
  },
  {
    "name":"Rizky H",
    "message":"Delivery is fast and the food quality is top-notch. Sometimes the portion feels a bit small, but overall it's been a great experience.",
    "star":4,
  },
  {
    "name":"Clara W.",
    "message":"I'm vegetarian and it's usually hard to find meal plans that suit me. SEA Catering's Vegetarian Wellness Plan is absolutely perfect!",
    "star":5,
  },
  {
    "name":"Kevin M.",
    "message":"The app makes ordering really easy. I've tried both the Weight Loss and Fit & Fresh plans—both were delicious and kept me full.",
    "star":4,
  },
  {
    "name":"Yuni S.",
    "message":"Good food and I appreciate the detailed nutritional info. Just wish there were more variety in the weekly menus.",
    "star":3,
  }
]