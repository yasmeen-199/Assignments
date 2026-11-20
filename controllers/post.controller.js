
const { User, Post, Comment } = require('../models');

const createPost = async (req, res) => {
    try {
        const { title, content, userId } = req.body;

        const post = new Post({
            title,
            content,
            userId
        });

        await post.save();

        res.status(201).json({
            message: 'Post created successfully.'
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const deletePost = async (req, res) => {
    try {
        const { userId } = req.body;

        const post = await Post.findByPk(req.params.postId);

        if (!post) {
            return res.status(404).json({
                message: 'Post not found.'
            });
        }

        if (post.userId !== Number(userId)) {
            return res.status(403).json({
                message: 'You are not authorized to delete this post.'
            });
        }

        await post.destroy();

        res.status(200).json({
            message: 'Post deleted.'
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getPostsDetails = async (req, res) => {
    try {
        const posts = await Post.findAll({
            attributes: ['id', 'title'],
            include: [
                {
                    model: User,
                    attributes: ['id', 'name']
                },
                {
                    model: Comment,
                    attributes: ['id', 'content']
                }
            ]
        });

        res.status(200).json(posts);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getPostsCommentCount = async (req, res) => {
    try {
        const posts = await Post.findAll({
            attributes: ['id', 'title']
        });

        const result = await Promise.all(
            posts.map(async (post) => {
                const commentCount = await Comment.count({
                    where: {
                        postId: post.id
                    }
                });

                return {
                    id: post.id,
                    title: post.title,
                    commentCount
                };
            })
        );

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createPost,
    deletePost,
    getPostsDetails,
    getPostsCommentCount
};
