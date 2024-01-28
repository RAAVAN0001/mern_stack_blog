const jwt = require('jsonwebtoken')
const {HttpError} = require('../models/errorModel')


const authMiddleWare = async (req, res, next) => {
    const Authorization = req.headers.Authorization || req.headers.authorization
    if (Authorization && Authorization.startsWith("Bearer")) {
        const token = Authorization.split(' ')[1]
        jwt.verify(token, process.env.JWT_SCERET, (err, info) => {
            if (err) {
                return next(new HttpError('unauthorized invalid token', 403))
            }
            req.user = info;
            next()
        })
    } else {
        return next(new HttpError('unauthorization. no token', 402))
    }
}


module.exports = authMiddleWare