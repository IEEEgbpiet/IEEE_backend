
import mongoose from "mongoose";
import Announcement from "../../../models/annoucement.js";
import { deleteFromCloudinary } from "../../../config/cloudinary.js";

const DeleteService = async (id) => {
  const filter = mongoose.isValidObjectId(id)
    ? { $or: [{ AnnouncementId: id }, { _id: id }] }
    : { AnnouncementId: id };

  const announcement = await Announcement.findOne(filter);

  if (!announcement) {
    throw new Error("Announcement not found");
  }

  // Delete image from Cloudinary if it exists
  if (announcement.image?.publicId) {
    await deleteFromCloudinary(announcement.image.publicId);
  }

  // Delete announcement from database
  await Announcement.deleteOne({ _id: announcement._id });

  return announcement;
};

export default DeleteService;
