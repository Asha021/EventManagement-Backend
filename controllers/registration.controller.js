import Registration from "../models/registration.model.js";
import Event from "../models/event.model.js";

export const registerEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (event.availableSeats <= 0) {
      return res.status(400).json({
        message: "No seats available",
      });
    }

    const alreadyRegistered = await Registration.findOne({
      user: userId,
      event: eventId,
      status: "registered",
    });

    if (alreadyRegistered) {
      return res.status(400).json({
        message: "Already registered",
      });
    }

    await Registration.create({
      user: userId,
      event: eventId,
    });

    event.availableSeats -= 1;

    await event.save();

    res.status(201).json({
      message: "Event Registered Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// my register event
export const myRegisteredEvents = async (req, res) => {
  try {
    const userId = req.user.id;

    const events = await Registration.find({
      user: userId,
      status: "registered",
    }).populate("event");

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// Cancel Registration
export const cancelRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;

    const registration = await Registration.findOne({
      user: userId,
      event: eventId,
      status: "registered",
    });

    if (!registration) {
      return res.status(404).json({
        message: "Registration not found",
      });
    }

    registration.status = "cancelled";
    await registration.save();

    const event = await Event.findById(eventId);

    if (event) {
      event.availableSeats += 1;
      await event.save();
    }

    res.status(200).json({
      success: true,
      message: "Registration cancelled successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};