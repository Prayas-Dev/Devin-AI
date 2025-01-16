import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        if (!email.includes('@') || password.length < 6) {
            setError('Invalid email or password must be at least 6 characters');
            return;
        }

        axios.post('/users/register', { email, password })
            .then((res) => {
                console.log(res.data);
                localStorage.setItem('token', res.data.token);
                setUser(res.data.user);
                navigate('/');
            })
            .catch((err) => {
                console.log(err.response?.data || 'An error occurred');
                setError(err.response?.data?.message || 'Failed to register');
            });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-white">Register</h2>
                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block mb-2 text-gray-400" htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                            className="w-full p-3 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            aria-label="Email"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-gray-400" htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                            className="w-full p-3 text-white bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            aria-label="Password"
                        />
                    </div>
                    {error && <p className="mb-4 text-red-500">{error}</p>}
                    <button
                        type="submit"
                        className="w-full p-3 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Sign Up
                    </button>
                </form>
                <p className="mt-4 text-gray-400">
                    Already have an account? <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
