import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../components/FormField';

export default function Register(props) {
    const [error, setError] = useState('');
    const firstName = useRef();
    const lastName = useRef();
    const email = useRef();
    const password = useRef();
    const confirmPassword = useRef();

    const handleSubmit = async e => {
        e.preventDefault();
        const body = {
            firstName: firstName.current.value,
            lastName: lastName.current.value,
            email: email.current.value,
            password: password.current.value,
        };

        const res = await fetch('http://localhost:5000/api/users/register', {
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

    const checkName = '^[A-z]{3,30}$';

    const checkEmail = String.raw`^[\w\.]{1,40}@\w{1,15}\.\w{2,4}$`;

    const checkPassword = '^.{8,60}$';

    return (
        <>
            <form onSubmit={handleSubmit}>
                <FormField
                    label='Ime'
                    name='fistName'
                    type='text'
                    refer={firstName}
                    pattern={checkName}
                    required
                />
                <FormField
                    label='Prezime'
                    name='lastName'
                    type='text'
                    refer={lastName}
                    pattern={checkName}
                    required
                />
                <FormField label='Email' name='email' type='email' refer={email} pattern={checkEmail} required />
                <FormField
                    label='Šifra'
                    name='password'
                    type='password'
                    refer={password}
                    pattern={checkPassword}
                    required
                />
                <FormField
                    label='Potvrdite Šifru'
                    name='confirmPassword'
                    type='password'
                    refer={confirmPassword}
                    pattern={checkPassword}
                    required
                />
                {error}
                <button type='Submit'>Register</button>
            </form>
            <Link to='/login'>Login</Link>
        </>
    );
}
