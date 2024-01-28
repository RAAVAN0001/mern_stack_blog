import React, { useContext, useEffect } from 'react'

import { UserContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'

const LogoutPage = () => {
  const { setCurrentUser } = useContext(UserContext)
  const navigate = useNavigate()


  setCurrentUser(null)
  navigate('/login', { replace: true })
  window.location.reload()

  return (
    <>

    </>
  )
}

export default LogoutPage