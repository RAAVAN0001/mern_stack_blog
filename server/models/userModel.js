const { Schema, model } = require('mongoose');
const validator = require('validator');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: (props) => `${props.value} is not a valid email address!`,
        },
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    posts: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

module.exports = model('User', userSchema);
