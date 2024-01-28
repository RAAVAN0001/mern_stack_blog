const { Router } = require('express')
const authMiddleWare = require('../middleware/AuthMiddleware')
const {
    registerUser,
    loginUser,
    getUser,
    changeAvatar,
    editUser,
    getAuthors
} = require('../controller/userControllers')

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/authors', getAuthors)
router.post('/change-avatar', authMiddleWare, changeAvatar)
router.patch('/edit-user',authMiddleWare, editUser)
router.get('/:id', getUser)


module.exports = router