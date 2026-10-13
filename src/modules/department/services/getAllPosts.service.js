import DepartmentPost from "../../../models/DepartmentPost.js";

const getAllPostsService = async (dep, admin) => {
  const query = dep ? { branch: dep } : {};

  if (admin !== "true") {
    query.visibilityStatus = { $ne: false };
  }

  const posts = await DepartmentPost.find(query).sort({ createdAt: -1 });
  return posts;
};

export { getAllPostsService };