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