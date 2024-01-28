const Post = require('../models/postModel')
const User = require('../models/userModel')

const path = require('path')
const fs = require('fs')
const { HttpError } = require("../models/errorModel");

const { v4: uuid } = require('uuid')






// ----------------------------create a post
// GET : api/posts/
//Unprotected
const createPost = async (req, res, next) => {
    try {
        const { title, category, description } = req.body
        if (!title || !category || !description || !req.files) {
            return next(new HttpError('fill in all fields and choose thumbnail', 422))
        }
        const { thumbnail } = req.files;
        if (thumbnail.size > 2000000) {
            return next(new HttpError('thumbnail too big, file shoud be less then 2MB.'))
        }
        let fileName = thumbnail.name;
        let splittedfileName = fileName.split('.')
        let newFileName = splittedfileName[0] + uuid() + '.' + splittedfileName[splittedfileName.length - 1]
        thumbnail.mv(path.join(__dirname, "..", '/Uploads', newFileName), async (err) => {
            if (err) {
                return next(new HttpError(err))
            } else {
                const newPost = await Post.create({
                    title,
                    category,
                    description,
                    thumbnail: newFileName,
                    creator: req.user.id
                })
                if (!newPost) {
                    return next(new HttpError(" post couldn't be created...", 422))
                }
                const currentUser = await User.findById(req.user.id)
                const userPostCount = currentUser.posts + 1;
                await User.findByIdAndUpdate(req.user.id, { posts: userPostCount })

                res.status(201).json(newPost)
            }
        })
    } catch (error) {
        return next(new HttpError(error))
    }
}




// ----------------------------get post
// POST : api/getposts
//Protected
const getPosts = async (req, res, next) => {
    try {
        const post = await Post.find().sort({ updatedAt: -1 })
        res.status(200).json(post)
    } catch (error) {
        return next(new HttpError(error))
    }
}


// ----------------------------get post
// POST : api/getposts
//Protected
const getPost = async (req, res, next) => {
    try {
        const postId = req.params.id
        const post = await Post.findById(postId);
        if (!post) {
            return next(new HttpError('post not found', 404))
        }
        res.status(200).json(post)
    } catch (error) {
        return next(new HttpError(error))
    }
}

// ----------------------------get post belong to particular categroies
// GET : api/posts/categories/:category
//unProtected
const getCatPost = async (req, res, next) => {
    try {
        const { category } = req.params;
        const catPost = await Post.find({ category }).sort({ createdAt: -1 })
        res.status(200).json(catPost)
    } catch (error) {
        return next(new HttpError(error))
    }
}


// ----------------------------get post by auhtor
// GET : api/posts/users/:id
//UNprotected
const getUserPost = async (req, res, next) => {
    try {
        const { id } = req.params
        const posts = await Post.find({ creator: id }).sort({ createdAt: -1 })
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}
// ----------------------------update post
// PATCH : api/posts/:id
//protected
const editPost = async (req, res, next) => {
    try {
        let fileName;
        let newFileName;
        let updatedPost;

        const postId = req.params.id;
        const { title, category, description } = req.body;

        if (!title || !category || description.length < 12 || !req.body) {
            return next(new HttpError('Fill in all fields', 422));
        }

        const oldPost = await Post.findById(postId);

        if (!oldPost) {
            return next(new HttpError('Post not found', 404));
        }

        if (req.user.id !== oldPost.creator.toString()) {
            return next(new HttpError('Unauthorized', 401));
        }

        if (!req.files) {
            updatedPost = await Post.findByIdAndUpdate(postId, { title, description, category }, { new: true });
        } else {
            const { thumbnail } = req.files;

            if (thumbnail.size > 2000000) {
                return next(new HttpError('Thumbnail is too big. It should be less than 2MB', 422));
            }

            fileName = thumbnail.name;
            const splittedFileName = fileName.split('.');
            newFileName = `${splittedFileName[0]}${uuid()}.${splittedFileName[splittedFileName.length - 1]}`;

            await thumbnail.mv(path.join(__dirname, '..', 'Uploads', newFileName));

            // Delete old thumbnail if it exists
            const oldThumbnailPath = path.join(__dirname, '..', 'Uploads', oldPost.thumbnail);
            fs.unlink(oldThumbnailPath, async (err) => {
                if (err && err.code !== 'ENOENT') {
                    return next(new HttpError(err.message, 500));
                }
            });

            updatedPost = await Post.findByIdAndUpdate(postId, {
                title,
                description,
                category,
                thumbnail: newFileName,
            }, { new: true });
        }

        if (!updatedPost) {
            return next(new HttpError("Couldn't update post", 400));
        }

        res.status(200).json(updatedPost);
    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};



// ----------------------------delete post
// DELETE : api/posts/:id
//protected
const detelePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        if (!postId) {
            return next(new HttpError('Post unavailable.', 400))
        }
        const post = await Post.findById(postId)
        const fileName = post?.thumbnail;
        if (req.user.id == post.creator) {

            fs.unlink(path.join(__dirname, '..', 'Uploads', fileName), async (err) => {
                if (err) {
                    return next(new HttpError(err))
                } else {
                    await Post.findByIdAndDelete(postId);
                    // find user and reduce post count by 1
                    const currentUser = await User.findById(req.user.id)
                    const userPostCount = currentUser?.posts - 1;
                    await User.findByIdAndUpdate(req.user.id, { posts: userPostCount })
                    res.status(200).json(`post ${postId} delered successfully`)
                }

            })
        } else {
            return next(new HttpError('Post couldnot be deleted', 403))
        }


    } catch (error) {
        return next(new HttpError(error))
    }
}



module.exports = {
    createPost,
    getPosts,
    getPost,
    getCatPost,
    getUserPost,
    editPost,
    detelePost
}