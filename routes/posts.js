const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const verify = require('./verifyToken')

// Get all posts
router.get('/', verify, async (req,res) => {
    // try {
    //     const posts = await Post.find();
    //     res.json(posts);
    // } catch(err) {
    //     res.json({message:err});
    // }
});

// Submit post
router.post('/', async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });
    try {
        const savedPost = await post.save();
        res.json(savedPost);
    } catch (err) {
        res.json({message: err});
    }
});

// Get specific post
router.post('/:postId', async (req,res) => {
    try {
        const post = Post.findById(req.params.postId);
        res.json(post);
    } catch(err) {
        res.json({message:err});
    }
});

// Update post
router.patch('/:postId', async (req,res) => {
    try {
        const updatePost = await Post.updateOne(
            {_id: req.params.postId},
            {$set: {title: req.body.title}
        });
        res.json(updatePost);
    } catch(err) {
        res.json({message:err});
    }
});

// Delete a post
router.delete('/:postId', async (req,res) => {
    try {
        const removedPost = await Post.remove({_id: req.params.postId});
        res.json(removedPost)
    } catch(err) {
        res.json({message:err});
    }
});

module.exports = router;