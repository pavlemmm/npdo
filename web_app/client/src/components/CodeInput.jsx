import { useState } from 'react';

export default function CodeInput({ setCode }) {
    const [codeInput, setCodeInput] = useState('');
    const [error, setError] = useState('');

    const handleSendCode = async () => {
        const res = await fetch('http://localhost:5000/api/actions/' + codeInput);

        if (res.ok) {
            setError('');
            localStorage.setItem('code', codeInput);
            setCode(codeInput);
        } else {
            const data = await res.json();
            setError(data);
        }
    };
    return (
        <>
            Unesite vaš kod:
            <input
                type='number'
                min={'1000'}
                max={'9999'}
                value={codeInput}
                onChange={e => {
                    setCodeInput(e.target.value);
                    if (e.target.value < 1000 || e.target.value > 9999 || e.target.value % 1 != 0) {
                        setError('Kod treba da bude četvorocifreni broj');
                        return;
                    }
                    setError('');
                }}
            />
            <button onClick={handleSendCode} disabled={error}>
                Unesi
            </button>
            {error}
        </>
    );
}
