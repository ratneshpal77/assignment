import eventModel from "../models/event.model.js";
import seatModel from "../models/seat.model.js";
import reservationModel from "../models/reservation.model.js";
import mongoose from "mongoose";

export const createEvent = async (req, res) => {
  try {
    const { name, totalSeats, venue, date, time } = req.body;

    console.log(eventModel);

    const event = await eventModel.create({
      name,
      totalSeats,
      venue,
      date,
      time,
    });

    const seats = [];

    for (let i = 1; i <= totalSeats; i++) {
      seats.push({
        eventId: event._id,
        seatNumber: `S${i}`,
        status: "available",
      });
    }

    await seatModel.insertMany(seats);

    res.status(201).json({
      success: true,
      message: "Event and seats created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEventSeats = async (req, res) => {
  try {
    const { id } = req.params;

    const seats = await seatModel.find({
      eventId: id,
    });

    res.status(200).json({
      success: true,
      count: seats.length,
      seats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await eventModel.find().sort({ date: 1 });

    console.log();

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID",
      });
    }

    const event = await eventModel.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const reserveSeats = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const { userId, eventId, seatNumbers } = req.body;

    const seats = await seatModel
      .find({
        eventId,
        seatNumber: {
          $in: seatNumbers,
        },
        status: "available",
      })
      .session(session);

    if (seats.length !== seatNumbers.length) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Some seats are already reserved/booked",
      });
    }

    await seatModel.updateMany(
      {
        eventId,
        seatNumber: {
          $in: seatNumbers,
        },
      },
      {
        $set: {
          status: "reserved",
        },
      },
      {
        session,
      },
    );

    const reservation = await reservationModel.create(
      [
        {
          userId,
          eventId,
          seatNumbers,

          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      ],
      { session },
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      reservation: reservation[0],
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};

export const bookSeats = async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const { reservationId } = req.body;

    const reservation = await reservationModel
      .findById(reservationId)
      .session(session);

    if (!reservation) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    if (reservation.expiresAt < new Date()) {
      await seatModel.updateMany(
        {
          eventId: reservation.eventId,

          seatNumber: {
            $in: reservation.seatNumbers,
          },
        },
        {
          status: "available",
        },
        {
          session,
        },
      );

      await reservationModel.findByIdAndDelete(reservationId, {
        session,
      });

      await session.commitTransaction();

      return res.status(400).json({
        success: false,
        message: "Reservation expired",
      });
    }

    console.log("Reservation:", reservation);

    await seatModel.updateMany(
      {
        eventId: reservation.eventId,
        seatNumber: {
          $in: reservation.seatNumbers,
        },
      },
      {
        status: "booked",
      },
      {
        session,
      },
    );

    await reservationModel.findByIdAndDelete(reservationId, {
      session,
    });

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Booking completed successfully",
    });
  } catch (error) {
    await session.abortTransaction();

    res.status(500).json({
      success: false,
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};
