const { Router } = require('express')

const {
    createPost,
    getPosts,
    getPost,
    getCatPost,
    getUserPost,
    editPost,
    detelePost
} = require('../controller/postControllers')
const authMiddleWare = require('../middleware/AuthMiddleware')

const router = Router()

router.post('/',authMiddleWare, createPost)

router.get('/', getPosts)

router.get('/:id', getPost)

router.get('/categories/:category', getCatPost)

router.get('/users/:id', getUserPost)

router.patch('/:id',authMiddleWare, editPost)

router.delete('/:id',authMiddleWare, detelePost)


module.exports = router