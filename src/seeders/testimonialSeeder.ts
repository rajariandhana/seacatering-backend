import TestimonialModel from "../models/testimonial.model";

const defaultTestimonials=[
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

export async function seedTestimonials(){
  await TestimonialModel.insertMany(defaultTestimonials);
  console.log(`${defaultTestimonials.length} testimonials inserted`);
}