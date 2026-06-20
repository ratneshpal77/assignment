import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Event name is required"],
    trim: true,
  },
  totalSeats: {
    type: Number,
    required: [true, "Total seats is required"],
    min: 1,
  },
  venue: {
    type: String,
    required: [true, "Venue is required"],
    trim: true,
  },
  date: {
    type: Date,
    required: [true, "Event date is required"],
  },
  time: {
    type: String,
    required: [true, "Event time is required"],
  },
  
  
  
});

const eventModel = mongoose.model("Event", eventSchema);

export default eventModel;
