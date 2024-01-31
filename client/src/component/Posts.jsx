import React, { useEffect, useState } from 'react'
import PostItem from './PostItem'
import Loader from './Loader'
import axios from 'axios'

const Posts = () => {


    const [isLoading, setIsLoading] = useState(false)

    const [posts, setPosts] = useState([])

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`https://blog-server-yr2c.onrender.com/api/posts`)
                setPosts(response?.data)
                // console.log(response.data)

            } catch (err) {
                console.log(err)
            }
            setIsLoading(false)
        }
        fetchPosts();
    }, [])

    if (isLoading) {
        return <Loader />
    }


    return (
        <section className="posts">
            {posts.length > 0 ? <div className="container posts__container">
                {
                    posts.map(({ _id:id, thumbnail, category, title, description, creator,createdAt }) => <PostItem key={id} thumbnail={thumbnail} title={title} postID={id} category={category} description={description} authorID={creator} createdAt={createdAt} />)
                }

            </div> : <h2 className='center'>no posts</h2>
            }
        </section>
    )
}

export default Posts