import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Loader from '../component/Loader'
import axios from 'axios'

import { RxAvatar } from 'react-icons/rx'
import pic from '../images/defalutpic.webp'

const Authors = () => {



  const [authors, setAuthors] = useState([])
  const [isloading, setIsLoading] = useState(false)


  useEffect(() => {
    console.log(`${import.meta.env.VITE_APP_ASSETS_URI}`)
    const getAuthors = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URI}/users/authors`)
        setAuthors(response?.data)
      } catch (err) {
        console.log(err)
      }
      setIsLoading(false)
    }
    getAuthors();
  }, [])


  if (isloading) {
    return <Loader />
  }


  return (
    <section className="authors">
      {authors.length > 0 ? <div className="container authors__container">
        {
          authors.map(({ _id: id, avatar, name, posts }) => {
            return <Link key={id} to={`/posts/users/${id}`} className='author'>
              <div className="author__avatar">
                <img src={`https://blog-server-yr2c.onrender.com/Uploads/${avatar}`} />
              </div>
              <div className="author__info">
                <h4>{name}</h4>
                <p>{posts}</p>
              </div>
            </Link>
          })
        }
      </div> : <h2 className='center'>No Users/Authors Found</h2>
      }
    </section>

  )
}

export default Authors