import { useEffect, useState } from 'react';
import CodeInput from '../components/CodeInput';
import DisplayCard from '../components/DisplayCard';

export default function Display({ cards }) {
    const [code, setCode] = useState(localStorage.getItem('code'));

    if (code) {
        return <DisplayCard cards={cards} code={code} />;
    } else {
        return <CodeInput setCode={setCode} />;
    }
}
