import mongoose from 'mongoose';
import DepartmentPost from '../../../models/DepartmentPost.js';

const toggleVisibilityService = async (id, visibilityStatus) => {
  const filter = mongoose.isValidObjectId(id)
    ? { $or: [{ postId: id }, { _id: id }] }
    : { postId: id };

  const post = await DepartmentPost.findOneAndUpdate(
    filter,
    { visibilityStatus },
    { new: true },
  );

  if (!post) {
    throw new Error('Post not found');
  }

  return post;
};

export { toggleVisibilityService };

