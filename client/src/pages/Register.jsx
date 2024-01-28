import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    // console.log(import.meta.env.VITE_APP_BASE_URI)
    const baseUri = import.meta.env.VITE_APP_BASE_URI;
    const [userData, setUserData] = useState({
        name: "",
        email: '',
        password: '',
        password2: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const changeInputHandler = (e) => {
        setUserData(prevState => {
            return { ...prevState, [e.target.name]: e.target.value };
        });
    };

    const registerUser = async (e) => {
        e.preventDefault();

        setError('');

        try {
            const response = await axios.post(`${baseUri}/users/register`,
                userData);
            const newUser = response.data;
            console.log(newUser);
            if (!newUser) {
                setError('Could not register user. Please try again.');
            }
            navigate('/login');
        } catch (err) {
            // console.log(err.response.data);
            setError(err.response.data.message);
        }


    };

    return (
        <section className="register">
            <div className="container">
                <h2>Sign up</h2>
                <form action="" className="form register__form" onSubmit={registerUser}>
                    {error && <p className="form__error-message">{error}</p>}
                    <input type="text" placeholder='Full Name' name='name' value={userData.name} onChange={changeInputHandler} />
                    <input type="email" placeholder='email' name='email' value={userData.email} onChange={changeInputHandler} />
                    <input type="password" placeholder='password' name='password' value={userData.password} onChange={changeInputHandler} />
                    <input type="password" placeholder='confirm password' name='password2' value={userData.password2} onChange={changeInputHandler} />

                    <button type="submit" onSubmit={registerUser} className='btn primary'>Register</button>

                    <small><Link to={'/login'}>Already have an account? Sign in</Link></small>
                </form>
            </div>
        </section>
    );
};

export default Register;
