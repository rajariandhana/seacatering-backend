import mongoose from "mongoose";

export interface Subscription {
  name:string;
  phoneNumber:string;
  planKey:string;
  mealType:string[];
  deliveryDays:string[];
  allergies?:string;
  notes?:string;
  totalPrice:number;
  createdAt?: string;
}

const Schema = mongoose.Schema;
const SubscriptionSchema = new Schema<Subscription>({
  name:{
    type: String,
    required:true,
  },
  phoneNumber:{
    type: String,
    required:true,
  },
  planKey:{
    type: String,
    required:true,
  },
  mealType:{
    type: [String],
    required:true,
  },
  deliveryDays:{
    type: [String],
    required:true,
  },
  allergies:{
    type: String,
    required:false,
  },
  notes:{
    type: String,
    required:false,
  },
  totalPrice:{
    type: Number,
    required:true,
  },
},{
  timestamps: true,
});

const SubscriptionModel = mongoose.model("Subscription", SubscriptionSchema);
export default SubscriptionModel;