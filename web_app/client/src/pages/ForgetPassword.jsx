import { useRef, useState } from 'react';
import FormField from '../components/FormField';

export default function ForgetPassword(props) {
    const [error, setError] = useState('');
    const email = useRef();

    const handleSubmit = async e => {
        e.preventDefault();
        const body = {
            email: email.current.value,
        };

        const res = await fetch('http://localhost:5000/api/users/forget-password', {
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
                <FormField label='Unesite vaš Email' name='email' type='email' refer={email} required />
                {error}
                <button type='Submit'></button>
            </form>
        </>
    );
}
