import Event from "../models/event.model.js";

// Create Event
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Events (now supports search, filter, and pagination via query params)
export const getAllEvents = async (req, res) => {
  try {
    const {
      q = "",
      category = "",
      location = "",
      date = "",
      page = 1,
      limit = 6,
    } = req.query;

    const filter = {};

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { organizer: { $regex: q, $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (location && location !== "all") {
      filter.location = location;
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 6;
    const skip = (pageNum - 1) * limitNum;

    const [events, total] = await Promise.all([
      Event.find(filter).sort({ date: 1 }).skip(skip).limit(limitNum),
      Event.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      hasMore: skip + events.length < total,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get distinct category/location values for filter dropdowns
export const getEventFilters = async (req, res) => {
  try {
    const [categories, locations] = await Promise.all([
      Event.distinct("category"),
      Event.distinct("location"),
    ]);

    res.status(200).json({
      success: true,
      categories,
      locations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Event
export const getSingleEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    console.log(req.params.id);
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

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};