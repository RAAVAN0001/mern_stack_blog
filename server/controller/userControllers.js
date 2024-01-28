const { HttpError } = require("../models/errorModel");
const User = require("../models/userModel");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')
// const {uuid} = require('uuid')
const { v4: uuidv4 } = require('uuid');


const fileUpload = require("express-fileupload");






// POST : api/users/register
// UNPROTECCTED
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, password2 } = req.body;
        if (!name || !email || !password || !password2) {
            return next(new HttpError("please fill all the fields", 422))
        }

        const newEmail = email.toLowerCase()

        const emailExists = await User.findOne({ email: newEmail })
        if (emailExists) {
            return next(new HttpError('Email already exists.', 422))
        }

        if ((password.trim()).length < 6) {
            return next(new HttpError('Password should be at least 6 characters', 422));
        }


        if (password !== password2) {
            return next(new HttpError("passwords do not match", 422))
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email: newEmail,
            password: hashedPass,
        })

        res.status(201).json(`new user ${newUser.email} registered `)



    } catch (error) {
        return next(new HttpError("user regostration failed", 422))
    }
}

// POST : api/users/login
// UNPROTECCTED
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new HttpError('Fill in all fields', 422));
        }

        const newEmail = email.toLowerCase();
        const user = await User.findOne({ email: newEmail });

        if (!user) {
            return next(new HttpError('Invalid credentials', 422));
        }

        const comparePass = await bcrypt.compare(password, user.password);

        if (!comparePass) {
            return next(new HttpError('Invalid credentials', 422));
        }

        const { _id: id, name } = user;
        const token = jwt.sign({ id, name }, process.env.JWT_SCERET, { expiresIn: '1d' });

        // Send an object as the response
        res.status(200).json({ token, id, name });
    } catch (error) {
        return next(new HttpError('Login failed. Please check your credentials', 422));
    }
};


// POST : api/users/:id
// PROTECCTED
const getUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).select('-password')
        if (!user) {
            return next(new HttpError('user not found', 404))
        }
        res.status(200).json(user)
    } catch (error) {
        return next(new HttpError(error))
    }
}


// PUT : api/users/change-avatar
// PROTECCTED
const changeAvatar = async (req, res, next) => {
    try {
        if (!req.files.avatar) {
            return next(new HttpError('please choose image', 422))
        }

        const user = await User.findById(req.user.id)
        if (user.avatar) {
            fs.unlink(path.join(__dirname, '..', 'Uploads', user.avatar), async (err) => {
                if (err) {
                    return next(new HttpError(err))
                }
            })
        }

        const { avatar } = req.files;
        if (avatar.size > 500000) {
            return next(new HttpError("profile pic is too big. should be less than 500kb", 422))
        }


        const fileName = avatar.name;
        let splittedFileName = fileName.split('.')
        let newFileName = splittedFileName[0] + uuidv4() + '.' + splittedFileName[splittedFileName.length - 1]

        const filePath = path.join(__dirname, '..', 'Uploads', newFileName);
        await avatar.mv(filePath, async (err) => {
            if (err) {
                return next(new HttpError(err))
            }
            const updatedAvatar = await User.findByIdAndUpdate(req.user.id, { avatar: newFileName }, { new: true })
            if (!updatedAvatar) {
                return next(new HttpError('avatar is not changed', 422))
            }
            res.status(200).json({ updatedAvatar })
        });

    } catch (error) {
        return next(new HttpError('Errorrrrrrrrr changing avatar', 500));
    }
};



// PUT : api/users/edit-user
// PROTECCTED
const editUser = async (req, res, next) => {
    try {
        const { name, email, currentPassword, newPassword, confirmNewPassword } = req.body;
        // if (!name || !email || !currentPassword || !newPassword) {
        //     return next(new HttpError('fill in all fields', 422))
        // }
        if (name) {
            const updatedName = await User.findByIdAndUpdate(req.user.id, { name }, { new: true });
            return res.status(200).json(updatedName);
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new HttpError('User noot found', 403))

        }
        const emailExists = await User.findOne({ email })
        if (emailExists && (emailExists._id != req.user.id)) {
            return next(new HttpError('email already exist', 422))
        }

        const validateUserPassword = await bcrypt.compare(currentPassword, user.password)
        if (!validateUserPassword) {
            return next(new HttpError('invalid current password', 422))
        }

        if (newPassword !== confirmNewPassword) {
            return next(new HttpError('new password do not match', 422))
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPass = await bcrypt.hash(newPassword, salt)

        const newInfo = await User.findByIdAndUpdate(req.user.id, { name, email, password: hashedPass }, { new: true })

        res.status(200).json(newInfo)

    } catch (error) {
        return next(new HttpError(error))
    }
}

// POST : api/users/authors
// UNPROTECCTED
const getAuthors = async (req, res, next) => {
    try {
        const authors = await User.find().select('-password');
        res.json(authors);
    } catch (error) {
        // Explicitly handle the error and pass it to the next middleware
        next(new HttpError(`Error fetching authors: ${error.message}`, 500));
    }
};



module.exports = {
    registerUser,
    loginUser,
    getUser,
    changeAvatar,
    editUser,
    getAuthors
}