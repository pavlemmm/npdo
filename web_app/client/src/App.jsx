import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Display from './pages/Display';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ForgetPassword from './pages/ForgetPassword';

const cards = [
    {
        card_id: 1,
        name: 'Slobodno vreme',
        image: './assets/cards/slobodno_vreme.jpg',
    },
    {
        card_id: 2,
        name: 'Pranje zuba',
        image: './assets/cards/pranje_zuba.jpg',
    },
    {
        card_id: 3,
        name: 'Namestanje kreveta',
        image: './assets/cards/namestanje_kreveta.jpg',
    },
    {
        card_id: 4,
        name: 'Polazak u skolu',
        image: './assets/cards/polazak_u_skolu.jpg',
    },
];

export default function App() {
    const [auth, setAuth] = useState(false);
    const [userData, setUserData] = useState({});

    const checkAuth = async () => {
        const token = localStorage.getItem('token');

        if (token) {
            const res = await fetch('http://localhost:5000/api/users/auth', {
                headers: { authorization: token },
            });

            const data = await res.json();

            if (res.ok) {
                setUserData(data);
                return setAuth(true);
            }
        }
        setAuth(false);
    };

    const handleAuth = (state, data) => {
        switch (state) {
            case 'OK':
                setAuth(true);
                localStorage.setItem('token', data.token);
                setUserData(data.payload);
                break;
            case 'FAILED':
                setAuth(false);
                localStorage.removeItem('token');
                break;
            case 'LOGOUT':
                setAuth(false);
                localStorage.removeItem('token');
                break;
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const OpenRoutes = () => {
        return !auth ? <Outlet /> : <Navigate to='/dashboard' />;
    };

    const ProtectedRoutes = () => {
        return auth ? <Outlet /> : <Navigate to='/' />;
    };

    return (
        <Routes>
            <Route element={<OpenRoutes />}>
                <Route path='/' element={<Home handleAuth={handleAuth} />} />
                <Route path='/login' element={<Login handleAuth={handleAuth} />} />
                <Route path='/forget-password' element={<ForgetPassword handleAuth={handleAuth} />} />
                <Route path='/register' element={<Register handleAuth={handleAuth} />} />
            </Route>

            <Route element={<ProtectedRoutes />}>
                <Route
                    path='/dashboard'
                    element={<Dashboard handleAuth={handleAuth} userData={userData} cards={cards} />}
                />
            </Route>

            <Route path='/display' element={<Display cards={cards} />} />
        </Routes>
    );
}
