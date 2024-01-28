import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../context/userContext'

const EditPost = () => {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Uncategorized')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [error, setError] = useState('')


  const navigate = useNavigate()
  const { id } = useParams()

  const { currentUser } = useContext(UserContext)
  const token = currentUser?.token
  //redirect to login page to any iuser who is not loged in
  useEffect(() => {
    if (!token) {
      navigate('/login')

    }
  }, [])




  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      ['clean']
    ]
  }

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image', 'video'
  ]

  const POST_CATEGORIES = [
    'Agriculture',
    'Business',
    'Education',
    'Entertainment',
    'Art',
    'Investment',
    'Uncategorized',
    'Weather'
  ];


  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_BASE_URI}/posts/${id}`)
        setTitle(response.data.title)
        setCategory(response.data.category)
        setDescription(response.data.description)
        setThumbnail(response.data.thumbnail)

      } catch (err) {
        console.log(err)
      }
    }
    getPost()
  },[])



  const editPost = async (e) => {
    e.preventDefault()

    const postData = new FormData()
    postData.append('title', title)
    postData.append('category', category)
    postData.append('description', description)
    postData.append('thumbnail', thumbnail)

    try {
      const response = await axios.patch(`${import.meta.env.VITE_APP_BASE_URI}/posts/${id}`, postData, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
      if (response.status == 200) {
        return navigate('/')
      }
    } catch (err) {
      setError(err.response.data.message)
      console.log(err)
    }

  }

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post</h2>
        {error && <p className="form__error-message">
          {error}
        </p>}
        <form action="" className="form create-post__form" onSubmit={editPost}>
          <input type="text" placeholder='Title' value={title} autoFocus onChange={e => setTitle(e.target.value)} />
          <select name="category"  value={category} onChange={e => setCategory(e.target.value)} >
            {POST_CATEGORIES.map((cat) => (
              <option value={cat} key={cat}>{cat}</option>
            ))}
          </select>
          <ReactQuill
            modules={modules}
            formats={formats}
            value={description}
            onChange={(setDescription)}
          />
          <input type="file" onChange={e => setThumbnail(e.target.files[0])} accept='png, jpg, jpeg' />
          <button type='submit' className='btn primary'>Update</button>
        </form>
      </div>
    </section >
  )
}

export default EditPost