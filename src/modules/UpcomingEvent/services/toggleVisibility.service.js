import mongoose from "mongoose";
import Event from "../../../models/upcomingEvents.js";

const toggleVisibilityService = async (id, visibilityStatus) => {
  const filter = mongoose.isValidObjectId(id)
    ? { $or: [{ postId: id }, { _id: id }] }
    : { postId: id };

  const post = await Event.findOneAndUpdate(
    filter,
    { visibilityStatus },
    { new: true },
  );

  if (!post) {
    throw new Error("Event not found");
  }

  return post;
};

export { toggleVisibilityService };
