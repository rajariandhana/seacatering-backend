import { en, Faker } from "@faker-js/faker/.";
import PlanModel from "../models/plan.model";
import UserModel from "../models/user.model";
import { ROLES } from "../utils/constant";
import { calculateTotalPrice, mealType, validWeekdays } from "../controllers/subscription.controller";
import SubscriptionModel from "../models/subscription.model";

async function fetchMembers(){
  return await UserModel.find({role:ROLES.MEMBER});
}
async function fetchPlans(){
  return await PlanModel.find();
}

const allergies = [
  "Peanuts",
  "Shellfish",
  "Milk",
  "Eggs",
  "Soy",
  "Wheat",
  "Tree nuts",
  "Fish",
  "Gluten",
  "Sesame",
];

function pickRandomItems<T>(list: T[]): T[] {
  const count = Math.floor(Math.random() * list.length) + 1;

  const shuffled = list.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}

export async function seedSubscriptions(faker:Faker) {
  let n=0;
  let paused=0;
  const members = await fetchMembers();
  const plans = await fetchPlans();
  const today = new Date();
  // console.log(plans);

  for(const member of members){
    // console.log(member)
    if(Math.random()<0.4)continue;

    const plan = plans[Math.floor(Math.random() * plans.length)];

    const rawPhone = faker.phone.number({style:"human"});
    const phoneNumber = rawPhone.replace(/\D/g, '');

    let randomAllergies;
    if(Math.random()<0.3){
      randomAllergies = pickRandomItems(allergies).join(", ");
    }
    
    let randomNote;
    if(Math.random()<0.3){
      randomNote = faker.lorem.sentence();
    }

    const types = pickRandomItems(mealType);
    const days = pickRandomItems(validWeekdays);

    const totalPrice = calculateTotalPrice(plan.price, mealType, days);
    
    const subscription = await SubscriptionModel.create({
      userId:member._id,
      planName:plan.name,
      phoneNumber,
      mealType:types,
      deliveryDays:days,
      allergies:randomAllergies,
      notes:randomNote,
      totalPrice:totalPrice
    })

    if(Math.random()<0.5){
      const pauseStart = new Date(today);
      pauseStart.setDate(today.getDate() - Math.floor(Math.random()*7)+1);
      const pauseEnd = new Date(today);
      pauseEnd.setDate(today.getDate() - Math.floor(Math.random()*7)+1);
      await SubscriptionModel.findOneAndUpdate(
        {_id: subscription._id},
        {pauseStart, pauseEnd}
      );
      paused++;
    }

    await UserModel.findByIdAndUpdate(member._id,{
      subscriptionId: subscription._id
    })
    n++;
  }

  console.log(`${n} subscription inserted, ${paused} is paused`);
}