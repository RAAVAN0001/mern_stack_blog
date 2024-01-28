import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { UserContext } from '../context/userContext'
import axios from 'axios'
import Loader from '../component/Loader'


const DeletePost = ({ postId: id }) => {

  const navigate = useNavigate()
  const location = useLocation()
  const [isLoading, setIsLoading] = useState(false)





  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token


  //redirect to login page to any iuser who is not loged in
  useEffect(() => {
    if (!token) {
      navigate('/login')

    }
  }, [])


  const removePost = async (id) => {
    setIsLoading(true)
    try {
      const response = await axios.delete(`${import.meta.env.VITE_APP_BASE_URI}/posts/${id}`, {
        withCredentials: true, headers: { Authorization: `Bearer ${token}` }
      })
      if (response.status == 200) {
        if (location.pathname == `/myposts/${currentUser.id}`) {
          navigate(0)
        } else {
          navigate('/')

        }
        setIsLoading(false)
      }
    } catch (err) {
      console.log(err)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <Link className='btn sm danger' onClick={() => removePost(id)}>Delete</Link>
  )
}

export default DeletePost