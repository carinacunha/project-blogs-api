const categoryService = require('../services/category.service');
const postService = require('../services/post.service');

const createPost = async (req, res) => {
  try {
    const { title, content, categoryIds } = req.body;
    const { userId } = req.payload.data;
    const categories = await categoryService.getCategories();
    const idsCat = categories.map((cat) => cat.dataValues.id);
    const idsIncludes = categoryIds.every((elem) => idsCat.includes(elem));
    if (idsIncludes === false) {
      return res.status(400).json({ message: 'one or more "categoryIds" not found' });
    } 
    const post = await postService.createPost({ userId, title, content, categoryIds });
    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ message: 'ERRO' });
  } 
};

const getPosts = async (_req, res) => {
  const posts = await postService.getPosts();
    return res.status(200).json(posts);
};

const getPostById = async (req, res) => {
  const { id } = req.params;
  const post = await postService.getPostById(id);
  if (!post) {
    return res.status(404).json({ message: 'Post does not exist' });
  } return res.status(200).json(post);
};

const getPostByTerm = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    const posts = await postService.getPosts();
    return res.status(200).json(posts);
  }
  const result = await postService.getByTerm(q);
  if (result.length === 0) {
    return res.status(200).json([]);
  } 
    return res.status(200).json(result);
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const { userId } = req.payload.data;
  if (!title || !content) {
    return res.status(400).json({ message: 'Some required fields are missing' });
  }
  const postToUpdated = await postService.getPostById(id);
  if (postToUpdated.userId !== userId) {
    return res.status(401).json({ message: 'Unauthorized user' });
  }
  const updated = await postService.updatePostById({ id, title, content });
  return res.status(200).json(updated);
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.payload.data;
  const postToDelete = await postService.getPostById(id);
  if (!postToDelete) {
    return res.status(404).json({ message: 'Post does not exist' });
  }
  if (postToDelete.userId !== userId) {
    return res.status(401).json({ message: 'Unauthorized user' });
  }
  await postService.deletePostById(id);
  return res.status(204).json();
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostByTerm,
};