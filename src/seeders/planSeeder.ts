import PlanModel from "../models/plan.model";

let defaultPlans = [
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
]

export async function seedPlans(){
  await PlanModel.insertMany(defaultPlans);
  console.log(`${defaultPlans.length} plans inserted`);
}