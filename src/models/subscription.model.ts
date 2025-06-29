import mongoose from "mongoose";

export interface Subscription {
  userId: mongoose.Types.ObjectId;
  phoneNumber:string;
  planName:string;
  mealType:string[];
  deliveryDays:string[];
  allergies?:string;
  notes?:string;
  totalPrice:number;
  paused:boolean;
  createdAt?: string;
}

const Schema = mongoose.Schema;
const SubscriptionSchema = new Schema<Subscription>({
  userId:{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique:true,
  },
  phoneNumber:{
    type: String,
    required:true,
  },
  planName:{
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
  paused:{
    type:Boolean,
    required:true,
    default:false,
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