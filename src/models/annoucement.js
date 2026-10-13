
import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    AnnouncementId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    image: {
      url: {
        type: String,
        trim: true,
      },

      publicId: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Announcement = mongoose.model(
  "Announcement",
  announcementSchema
);

export default Announcement;
