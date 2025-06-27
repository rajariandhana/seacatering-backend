import mongoose from "mongoose";

export interface Plan {
  key: string;
  name: string;
  price: number;
  description?: string;
  calories?: string;
  suitableFor?: string;
  highlights?: string[];
}

const Schema = mongoose.Schema;
const PlanSchema = new Schema<Plan>({
  key:{
    type: String,
    required:true,
    unique:true,
  },
  name:{
    type: String,
    required:true,
  },
  price:{
    type: Number,
    required:true,
  },
  description:{
    type: String,
    required:false,
  },
  calories:{
    type: String,
    required:false,
  },
  suitableFor:{
    type: String,
    required:false,
  },
  highlights:{
    type: [String],
    required:false,
  },
},{
  timestamps: true,
});

const PlanModel = mongoose.model("Plan", PlanSchema);
export default PlanModel;