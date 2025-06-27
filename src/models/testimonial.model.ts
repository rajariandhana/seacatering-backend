import mongoose from "mongoose";

export interface Testimonial {
  name:string;
  message:string;
  star:number;
}

const Schema = mongoose.Schema;
const TestimonialSchema = new Schema<Testimonial>({
  name:{
    type: String,
    required:true,
  },
  message:{
    type: String,
    required:true,
  },
  star:{
    type: Number,
    required:true,
  },
},{
  timestamps: true,
});

const TestimonialModel = mongoose.model("Testimonial", TestimonialSchema);
export default TestimonialModel;