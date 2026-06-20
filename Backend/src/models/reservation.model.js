import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
    index: true,
  },
  seatIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seat",
    },
  ],
  seatNumbers: [String],
  expiresAt: {
    type: Date,
    required: true,
    index: true,
  },
});

const reservationModel = mongoose.model("Reservation", reservationSchema);

export default reservationModel;
