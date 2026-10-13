
import AddnewService from "./services/addnew.service.js";
import DeleteService from "./services/Delete.service.js";
import EditService from "./services/Edit.service.js";
import GetallService from "./services/Getall.service.js";

// POST: Create announcement
// Frontend can send any combination of fields (title, description, image)
// but must provide at least one value
export const Addnew = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file;

    // At least one field must be provided
    if (!title && !description && !image) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field: title, description, or image",
      });
    }

    const announcement = await AddnewService({
      title,
      description,
      image,
    });

    return res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("Create announcement error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create announcement",
      error: error.message,
    });
  }
};

// DELETE: Delete announcement by ID (AnnouncementId or _id)
export const Delete = async (req, res) => {
  try {
    const { id } = req.params;

    const announcement = await DeleteService(id);

    return res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("Delete announcement error:", error);
    const statusCode =
      error.message === "Announcement not found" ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to delete announcement",
    });
  }
};

// PATCH: Update announcement by ID (AnnouncementId or _id)
// Frontend can send any combination of fields but must provide at least one
export const Edit = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const image = req.file;

    // At least one field must be provided
    if (!title && !description && !image) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update: title, description, or image",
      });
    }

    const announcement = await EditService(id, {
      title,
      description,
      image,
    });

    return res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      data: announcement,
    });
  } catch (error) {
    console.error("Edit announcement error:", error);
    const statusCode =
      error.message === "Announcement not found" ? 404 : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Failed to update announcement",
    });
  }
};

// GET: Fetch all announcements
export const Getall = async (req, res) => {
  try {
    const announcements = await GetallService();

    return res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    console.error("Fetch announcements error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch announcements",
      error: error.message,
    });
  }
};
