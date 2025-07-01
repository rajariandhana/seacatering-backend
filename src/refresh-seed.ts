import mongoose from "mongoose";
import { Faker, en, en_US, id_ID } from '@faker-js/faker';
import { DATABASE_URL } from "./utils/env";
import { seedMembers } from "./seeders/memberSeeder";
import UserModel from "./models/user.model";
import { ROLES } from "./utils/constant";
import PlanModel from "./models/plan.model";
import SubscriptionModel from "./models/subscription.model";
import TestimonialModel from "./models/testimonial.model";
import { seedPlans } from "./seeders/planSeeder";
import { seedTestimonials } from "./seeders/testimonialSeeder";
import { seedSubscriptions } from "./seeders/subscriptionSeeder";

const faker = new Faker({ locale: [id_ID,en]});

async function refreshAndSeed() {
  try {
    await mongoose.connect(DATABASE_URL as string, {
      dbName: "db-seacatering",
    });
    console.log("Database connected!");

    await UserModel.deleteMany({});
    await PlanModel.deleteMany({});
    await TestimonialModel.deleteMany({});
    await SubscriptionModel.deleteMany({});

    await UserModel.create({
      fullName: "Admin SEA Catering",
      email:"admin@seacatering.com",
      // password:"AX1e0g9Bq?DcyN(M",
      password:"Pass123?",
      role:ROLES.ADMIN,
    })
    console.log("Admin seeded");

    await seedMembers(faker, 20);
    await seedPlans();
    await seedTestimonials();
    await seedSubscriptions(faker);

    mongoose.disconnect();
  } catch (error) {
      console.error("Seeding failed:", error);
      mongoose.disconnect();
  }
}

refreshAndSeed();
// console.log(generateSecureRandomString(16));