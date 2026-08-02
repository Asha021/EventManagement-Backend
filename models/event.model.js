import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    organizer: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
   },
   time: {
      type: String,
      required: true,
  },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Conference",
        "Workshop",
        "Seminar",
        "Concert",
        "Sports",
        "Festival",
        "Other",
      ],
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", EventSchema);

export default Event;