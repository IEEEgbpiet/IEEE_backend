
import Announcement from "../../../models/annoucement.js";
import { uploadToCloudinary } from "../../../config/cloudinary.js";
import generateAnnouncementId from "../../../utils/AnnoucementIDgenerator.js";

const MAX_ATTEMPTS = 5;

const AddnewService = async ({ title, description, image }) => {
  // Step 1: Generate a unique AnnouncementId
  let uniqueAnnouncementId = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const candidateId = generateAnnouncementId();

    const exists = await Announcement.exists({
      AnnouncementId: candidateId,
    });

    if (!exists) {
      uniqueAnnouncementId = candidateId;
      break;
    }
  }

  if (!uniqueAnnouncementId) {
    throw new Error(
      `Failed to generate a unique AnnouncementId after ${MAX_ATTEMPTS} attempts`
    );
  }

  // Step 2: Upload image to Cloudinary (if provided)
  let imageData = {
    url: "",
    publicId: "",
  };

  if (image) {
    const uploaded = await uploadToCloudinary(image, "ieee-announcements");
    if (uploaded && uploaded.url) {
      imageData = uploaded;
    }
  }

  // Step 3: Create announcement
  const announcement = await Announcement.create({
    AnnouncementId: uniqueAnnouncementId,
    title,
    description,
    image: imageData,
  });

  return announcement;
};

export default AddnewService;
