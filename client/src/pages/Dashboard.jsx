import React, { useContext, useEffect, useState } from 'react'
import { DummyPosts } from '../data';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import Loader from '../component/Loader';
import DeletePost from './DeletePost';

const Dashboard = () => {

  const navigate = useNavigate()
  const { id } = useParams()
  const [Posts, setPosts] = useState([])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)



  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token
  //redirect to login page to any iuser who is not loged in
  useEffect(() => {
    if (!token) {
      navigate('/login')

    }
  }, [])


  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URI}/posts/users/${id}`, {
          withCredentials: true, headers: { Authorization: `Bearer ${token}` }
        })
        setPosts(response.data)
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
    <section className="dashboard">
      {
        Posts.length ? <div className="container dashboard__container">
          {
            Posts.map((post) => {
              return <article key={post.id} className='dashboard__posts'>
                <div className="dashboard__post-info">
                  <div className="dashboard__post-thumbnail">
                    <img src={`${import.meta.env.VITE_APP_ASSETS_URI}/Uploads/${post.thumbnail}`} alt="" />
                  </div>
                  <h5>{post.title}</h5>
                </div>
                <div className="dashboard__post-actions">
                  <Link to={`/posts/${post._id}`} className='btn sm'>View</Link>
                  <Link to={`/posts/${post._id}/edit`} className='btn sm primary'>Edit</Link>
                  {/* <Link to={`/posts/${post._id}/delete`} className='btn sm danger'>delete</Link> */}
                  <DeletePost postId={post._id} />
                </div>
              </article>
            })
          }
        </div> : <h2 className='center'> You have no post yet</h2>
      }
    </section>
  )
}

export default Dashboard