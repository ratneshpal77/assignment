import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
    index: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["available", "reserved", "booked"],
    default: "available",
    index: true,
  },  
});

const seatModel  = mongoose.model("seats", seatSchema);

export default seatModel;
