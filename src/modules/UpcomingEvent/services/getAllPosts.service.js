import Event from "../../../models/upcomingEvents.js";

const getAllPostsService = async (admin) => {
  const query = admin === "true" ? {} : { visibilityStatus: { $ne: false } };

  const posts = await Event.find(query).sort({ createdAt: -1 });

  return posts;
};

export { getAllPostsService };