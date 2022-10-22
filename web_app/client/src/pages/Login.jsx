import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../components/FormField';

export default function Login(props) {
    const [error, setError] = useState('');
    const email = useRef();
    const password = useRef();

    const handleSubmit = async e => {
        e.preventDefault();
        const body = {
            email: email.current.value,
            password: password.current.value,
        };

        const res = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (res.ok) {
            setError('');
            props.handleAuth('OK', data);
        } else {
            setError(data);
            props.handleAuth('FAILED');
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <FormField label='Email' name='email' type='email' refer={email} required />
                <FormField label='Šifra' name='password' type='password' refer={password} required />
                {error}
                <button type='Submit'>Login</button>
            </form>
            <Link to='/forget-password'>Zaboravili ste lozinku?</Link>
            Prvi put ste ovde i niste aktivirali nalog? <Link to='/register'>Registrujte se</Link>
        </>
    );
}
