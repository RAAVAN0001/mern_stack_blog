import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { FaCheck } from 'react-icons/fa'
import { UserContext } from '../context/userContext'
import axios from 'axios'

const UserProfile = () => {
    const [avatar, setAvatar] = useState('')
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [error, setError] = useState('')
    const [isAvatarTouched, setIsAvatarTouched] = useState(false)


    const navigate = useNavigate()

    const { currentUser } = useContext(UserContext)
    const token = currentUser?.token
    //redirect to login page to any iuser who is not loged in
    useEffect(() => {
        if (!token) {
            navigate('/login')

        }
    }, [])

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`https://blog-server-yr2c.onrender.com/api/users/${currentUser.id}`, {
                    headers:
                        { Authorization: `Bearer ${token}` }
                })
                

                const { name, email, avatar } = response.data
                setName(name)
                setEmail(email)
                setAvatar(avatar)


            } catch (err) {
                console.log(err)
            }
        }
        getUser()
    }, [])



    const changeAvatarHandler = async () => {

        setIsAvatarTouched(false)
        try {
            const postData = new FormData();
            postData.append('avatar', avatar);
            const response = await axios.post(`https://blog-server-yr2c.onrender.com/api/users/change-avatar`, postData, {
                 headers: { Authorization: `Bearer ${token}` }
            })
            setAvatar(response.data.avatar)
        } catch (err) {
            console.log(err)
        }
    }


    const updateUserDetail = async (e) => {
        e.preventDefault()


        try {
            const userData = new FormData()
            userData.append('avatar', avatar)
            userData.append('name', name)
            userData.append('email', email)
            userData.append('currentPassword', currentPassword)
            userData.append('newPassword', newPassword)
            userData.append('confirmNewPassword', confirmNewPassword)
            
            const response = await axios.patch(`${import.meta.env.VITE_APP_BASE_URI}/users/edit-user`, userData, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } })
            if (response.status == 200) {
                // log user out 
                navigate('/login')

            }
        } catch (err) {
            setError(err.response.data.message)
        }

    }



    return (
        <section className="profile">
            <div className="container profile__container">
                <Link to={`/myposts/${currentUser.id}`} className='btn'> My Posts </Link>
                <div className="profile__details">
                    <div className="avatar__wrapper">
                        <div className="profile__avatar">
                            <img src={`https://blog-server-yr2c.onrender.com/Uploads/${avatar}`} alt="" />
                        </div>
                        {/* from to update the avatar */}
                        <form action="" className="avatar__form">
                            <input type="file" name="avatar" id="avatar" onChange={e => setAvatar(e.target.files[0])} accept='png,jpg,jpeg' />
                            <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)} ><FaEdit /></label>
                        </form>
                        {/* <button className='profile__avatar-btn'><FaCheck /></button> */}
                        {
                            isAvatarTouched && <button className='profile__avatar-btn' onClick={changeAvatarHandler}><FaCheck /></button>
                        }
                    </div>
                    <h1>{currentUser.name}</h1>
                    {/* fomr */}
                    <form action="" className="form profile__form" onSubmit={updateUserDetail}>
                        {error && <p className="form__error-message">
                            {error}
                        </p>}


                        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder='full name' />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder='email' />




                        <input type="password" name="" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder='current password' />
                        <input type="password" name="" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder='new password' />
                        <input type="password" name="" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} placeholder='confirm new password' />
                        <button type="submit" className='btn primary'>Update details</button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default UserProfile