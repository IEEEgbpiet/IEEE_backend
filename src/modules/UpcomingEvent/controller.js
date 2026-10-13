import { createPostService } from "./services/CreatePost.service.js";
import { deletePostService } from "./services/deletePost.service.js";
import { editPostService } from "./services/EditPost.service.js";
import { getAllPostsService } from "./services/getAllPosts.service.js";
import { viewPostService } from "./services/ViewPost.service.js";
import { toggleVisibilityService } from "./services/toggleVisibility.service.js";

const createPost = async (req, res) => {
  try {
    const image = req.file;

    const { eventName, title, date, lastDate, overview } = req.body;

    const post = await createPostService({
      eventName,
      title,
      date,
      lastDate,
      overview,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      post,
    });
  } catch (error) {
    console.error("Create event error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create event",
    });
  }
};

const allPost = async (req, res) => {
  try {
    const { admin } = req.query;

    const posts = await getAllPostsService(admin);

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Get all events error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch events",
    });
  }
};

const viewPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await viewPostService(id);

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("View event error:", error);
    const statusCode = error.message === "Event not found" ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to fetch event",
    });
  }
};

const editPost = async (req, res) => {
  try {
    const { id } = req.params;

    const image = req.file;

    const { eventName, title, date, lastDate, overview } = req.body;

    const post = await editPostService(
      id,
      eventName,
      title,
      date,
      lastDate,
      overview,
      image,
    );

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      post,
    });
  } catch (error) {
    console.error("Edit event error:", error);
    const statusCode = error.message === "Event not found" ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update event",
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    await deletePostService(id);

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Delete event error:", error);
    const statusCode = error.message === "Event not found" ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete event",
    });
  }
};

const toggleVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { visibilityStatus } = req.body;

    if (typeof visibilityStatus !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "visibilityStatus must be a boolean",
      });
    }

    const post = await toggleVisibilityService(id, visibilityStatus);

    return res.status(200).json({
      success: true,
      message: `Event visibility set to ${visibilityStatus ? "online" : "offline"}`,
      post,
    });
  } catch (error) {
    console.error("Toggle event visibility error:", error);
    const statusCode = error.message === "Event not found" ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to toggle event visibility",
    });
  }
};

export { createPost, allPost, viewPost, editPost, deletePost, toggleVisibility };
