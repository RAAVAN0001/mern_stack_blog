import React, { useContext, useEffect, useState } from 'react'
import PostAuthor from './../component/PostAuthor';
import { Link, useParams } from 'react-router-dom';
import thumbnail from '../images/blog22.jpg'

import { UserContext } from '../context/userContext';
import Loader from '../component/Loader';
import DeletePost from './DeletePost';
import axios from 'axios';

const PostDetail = () => {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { currentUser } = useContext(UserContext)

    useEffect(() => {
        const getPost = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URI}/posts/${id}`)
                setPost(response.data)
                // console.log(response)
            } catch (err) {
                setError(err.message) // Set error message if API call fails
                console.log(err)
            }
            setIsLoading(false)
        }
        getPost()
    }, [id]) // Include 'id' in the dependency array to re-fetch post when 'id' changes

    if (isLoading) {
        return <Loader />
    }

    return (
        <section className="post-detail">
            {error && <p className='error'>{error}</p>}
            {post && (
                <div className="container post-detail__container">
                    <div className="post-detail__header">
                        <PostAuthor authorID={post.creator} createdAt={post.createdAt} />
                        {currentUser?.id === post?.creator && (
                            <div className="post-detail_buttons">
                                <Link to={`/posts/${post?._id}/edit`} className='btn sm primary'>Edit</Link>
                                <DeletePost postId={id} />
                            </div>
                        )}
                    </div>
                    <h1>{post.title}</h1>
                    <div className="post-detail__thumbnail">
                        <img src={`${import.meta.env.VITE_APP_ASSETS_URI}/Uploads/${post.thumbnail}`} alt="" />
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
                </div>
            )}
        </section>
    )
}

export default PostDetail;
