
import mongoose from "mongoose";
import Announcement from "../../../models/annoucement.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../../config/cloudinary.js";

const EditService = async (id, { title, description, image }) => {
  const filter = mongoose.isValidObjectId(id)
    ? { $or: [{ AnnouncementId: id }, { _id: id }] }
    : { AnnouncementId: id };

  const announcement = await Announcement.findOne(filter);

  if (!announcement) {
    throw new Error("Announcement not found");
  }

  // Handle image replacement if a new image is provided
  if (image) {
    // Delete old image from Cloudinary
    if (announcement.image?.publicId) {
      await deleteFromCloudinary(announcement.image.publicId);
    }

    const uploaded = await uploadToCloudinary(image, "ieee-announcements");
    if (uploaded && uploaded.url) {
      announcement.image = {
        url: uploaded.url,
        publicId: uploaded.publicId,
      };
    }
  }

  // Update only the fields that are provided
  if (title !== undefined) announcement.title = title;
  if (description !== undefined) announcement.description = description;

  await announcement.save();

  return announcement;
};

export default EditService;
