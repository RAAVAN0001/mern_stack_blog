const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Agriculture',
            'Business',
            'Education',
            'Entertainment',
            'Art',
            'Investment',
            'Uncategorized',
            'Weather'],
        message: 'VALUE IS NOT SUPPORTED'
    },
    description: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

}, { timestamps: true })


const Post = mongoose.model('Post', userSchema)

module.exports = Post