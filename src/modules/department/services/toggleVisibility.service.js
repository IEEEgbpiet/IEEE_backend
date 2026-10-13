import DepartmentPost from "../../../models/DepartmentPost.js";

const toggleVisibilityService = async (id, visibilityStatus) => {
  const post = await DepartmentPost.findOneAndUpdate(
    { postId: id },
    { visibilityStatus },
    { new: true },
  );

  if (!post) {
    throw new Error("Post not found");
  }

  return post;
};

export { toggleVisibilityService };
