import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from './../context/userContext';

const LoginPage = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: ''
  })

  const [error, setError] = useState('')
  const navigate = useNavigate()


  const { setCurrentUser } = useContext(UserContext)


  const changeInputHandler = (e) => {
    setUserData(prevState => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  }


  const loginUser = async (e) => {
    e.preventDefault();
    setError('')
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_BASE_URI}/users/login`, userData)
      const user = await response.data;
      setCurrentUser(user)
      navigate('/')
    } catch (err) {
      setError(err.response.data.message)
    }
  }


  return (
    <section className="register">
      <div className="container">
        <h2>Sign in</h2>
        <form action="" className="form login__form" onSubmit={loginUser}>
          {error && <p className="form__error-message">{error}</p>}
          {/* <input type="text" placeholder='Full Name' name='name' value={userData.name} onChange={changeInputHandler} /> */}
          <input type="email" placeholder='email' name='email' value={userData.email} onChange={changeInputHandler} autoFocus />
          <input type="password" placeholder='password' name='password' value={userData.password} onChange={changeInputHandler} />
          {/* <input type="password" placeholder='confirm password' name='password2' value={userData.password2} onChange={changeInputHandler} /> */}

          <button type="submit" className='btn primary'>Login</button>
          <small><Link to={'/register'}>Dont have an account? Sign up</Link></small>
        </form>
      </div>
    </section>
  )
}

export default LoginPage