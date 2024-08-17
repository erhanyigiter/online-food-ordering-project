import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, loginUser } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { loading, error, success, confirmationLink } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const email = params.get('email');

        if (token && email) {
            dispatch(loginUser({ username: email, password, token })).then(() => {
                navigate('/');
            });
        }
    }, [dispatch, navigate]);

    const handleRegister = (e) => {
        e.preventDefault();
        dispatch(registerUser({ username, password }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Kayıt Ol</h2>
                <form onSubmit={handleRegister} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-gray-700">Kullanıcı Adı</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-500 focus:border-red-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700">Şifre</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-red-500 focus:border-red-500"
                        />
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Hata! </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    {/* Success Alert */}
                    {success && confirmationLink && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                            <strong className="font-bold">Başarılı! </strong>
                            <span className="block sm:inline">
                                Kayıt başarılı! Lütfen e-postanızı doğrulamak için <a href={confirmationLink} className="underline text-green-800">buraya tıklayın.</a>
                            </span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 bg-red-600 text-white rounded-md transition ${
                            loading ? 'cursor-not-allowed' : 'hover:bg-red-700'
                        }`}
                    >
                        {loading ? 'Yükleniyor...' : 'Kayıt Ol'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
