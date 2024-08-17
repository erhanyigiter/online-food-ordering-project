import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Spinner } from 'reactstrap';
import { setToken } from '../../redux/slices/authSlice';

const LoginSuccessPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        // Query parametrelerinden token'ı al
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // Token'ı Redux state'e kaydet
            dispatch(setToken(token));
        }

        setTimeout(() => {
            navigate('/');
        }, 2000);
    }, [location.search, navigate, dispatch]);

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
            <Spinner />
            <p>Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz...</p>
        </Container>
    );
};

export default LoginSuccessPage;
