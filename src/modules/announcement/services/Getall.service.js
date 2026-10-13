
import Announcement from "../../../models/annoucement.js";

const GetallService = async () => {
  const announcements = await Announcement.find().sort({ createdAt: -1 });

  return announcements;
};

export default GetallService;
