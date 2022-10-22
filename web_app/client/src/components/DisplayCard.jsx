import { useRef } from 'react';
import { useState, useEffect } from 'react';

const MS24H = 24 * 60 * 60 * 1000;
const daysOfWeek = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja'];

export default function DisplayCard({ cards, code }) {
    const [card, setCard] = useState(cards[0]);
    const [next, setNext] = useState('');

    let { current: actions } = useRef();

    const calcMsFrom00 = localeTimeString => {
        let time = localeTimeString.split(':');
        time[0] = Number(time[0]);
        time[1] = Number(time[1]);
        return time[0] === 0 ? time[1] * 60 * 1000 : (time[0] * 60 + time[1]) * 60 * 1000;
    };

    const waitForAction = async (day, currIndex) => {
        setCard(cards.find(card => card.card_id === actions[day][currIndex].card_id));

        if (currIndex === actions[day].length - 1) {
            let nextDay = -1,
                diff = -1,
                j = day + 1;
            for (let i = 0; i < 7; i++) {
                if (j === 7) j = 0;
                if (actions[j].length > 0) {
                    nextDay = j;
                    diff = i;
                    break;
                }
                j++;
            }

            setNext(`Od ${actions[day][currIndex].starts} do ${daysOfWeek[nextDay]}, ${actions[nextDay][0].starts}`);
            setTimeout(() => {
                waitForAction(nextDay, 0);
            }, MS24H - actions[day][currIndex].time + diff * MS24H + actions[nextDay][0].time);
        } else {
            setNext(`Od ${actions[day][currIndex].starts} do ${actions[day][currIndex + 1].starts}`);
            setTimeout(() => {
                waitForAction(day, currIndex++);
            }, actions[day][currIndex + 1].time - actions[day][currIndex].time);
        }
    };

    const getActions = async () => {
        const res = await fetch('http://localhost:5000/api/actions/' + code);

        const data = await res.json();

        if (!res.ok) return;

        actions = [[], [], [], [], [], [], []];
        for (const d of data) {
            const time = calcMsFrom00(d.starts);
            actions[d.day].push({ card_id: d.card_id, starts: d.starts, time, day: d.day });
        }

        const currentDate = new Date();

        let currentDay = currentDate.getDay();
        currentDay = currentDay === 0 ? 6 : currentDay - 1;

        let currentTime = calcMsFrom00(currentDate.toLocaleTimeString('en-GB'));

        for (let i = 0; i < actions[currentDay].length - 1; i++) {
            if (currentTime >= actions[currentDay][i].time && currentTime <= actions[currentDay][i + 1].time) {
                setCard(cards.find(card => card.card_id === actions[currentDay][i].card_id));
                setNext(`Od ${actions[currentDay][i].starts} do ${actions[currentDay][i + 1].starts}`);
                setTimeout(() => {
                    waitForAction(currentDay, i + 1);
                }, actions[currentDay][i + 1].time - currentTime);
                return;
            }
        }

        let nextDay = -1,
            diff = -1,
            j = currentDay + 1;
        for (let i = 0; i < 7; i++) {
            if (j === 7) j = 0;
            if (actions[j].length > 0) {
                nextDay = j;
                diff = i;
                break;
            }
            j++;
        }

        const lastIndex = actions[currentDay].length - 1;
        if (actions[currentDay].length) {
            setCard(cards.find(card => card.card_id === actions[currentDay][lastIndex].card_id));
            setNext(
                `Od ${actions[currentDay][lastIndex].starts} do ${daysOfWeek[nextDay]}, ${actions[nextDay][0].starts}`
            );
            setTimeout(() => {
                waitForAction(nextDay, 0);
            }, MS24H - currentTime + diff * MS24H + actions[nextDay][0].time);
            return;
        }

        // Ako nema, slobodno vreme
        setCard(cards[0]);
    };

    // useEffect(()=>{
    //     console.log(actions)
    // })

    useEffect(() => {
        getActions();
    }, []);

    return (
        <div>
            <h2>{card.name}</h2>
            <p>{next}</p>
            <button onClick={() => setCard(cards[0])} disabled={card.card_id === 1}>
                Zavrseno!
            </button>
        </div>
    );
}
