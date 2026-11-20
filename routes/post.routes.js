
const express = require('express');
const router = express.Router();

const {
    createPost,
    deletePost,
    getPostsDetails,
    getPostsCommentCount
} = require('../controllers/post.controller');

router.post('/', createPost);
router.get('/details', getPostsDetails);
router.get('/comment-count', getPostsCommentCount);
router.delete('/:postId', deletePost);

module.exports = router;
