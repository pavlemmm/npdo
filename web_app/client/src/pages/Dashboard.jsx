import { useEffect, useState } from 'react';
import { Card, CardAdd, CardPlus } from '../components/Card';
import { Link } from 'react-router-dom';
import './Dashboard.scss';

const daysOfWeek = ['Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota', 'Nedelja'];

export default function Dashboard({ handleAuth, userData, cards }) {
    const [actions, setActions] = useState([]);
    const [errors, setErrors] = useState([]);

    const [overlay, setOverlay] = useState(false);
    const [selectedDay, setSelectedDay] = useState(0);

    const getActions = async () => {
        const res = await fetch('http://localhost:5000/api/actions/', {
            headers: { authorization: localStorage.getItem('token') },
        });
        const data = await res.json();

        const temp = [[], [], [], [], [], [], []];
        const temp2 = [[], [], [], [], [], [], []];
        for (const d of data) {
            temp[d.day].push(d);
            temp2[d.day].push('');
        }

        setActions(temp);
        setErrors(temp2);
    };

    useEffect(() => {
        getActions();
    }, []);

    const setErrorAtIndex = (day, index, message) => {
        setErrors(oldVal => {
            const temp = [...oldVal];
            temp[day][index] = message;
            return temp;
        });
    };

    const handlePostActions = async () => {
        // Check errors
        for (let i = 0; i < actions.length; i++) {
            for (let j = 0; j < actions[i].length; j++) {
                if (actions[i][j].starts === '') {
                    setErrorAtIndex(i, j, 'Vreme nije uneseno!');
                    return;
                }
            }
        }

        const body = [];
        for (let i = 0; i < actions.length; i++) {
            for (let j = 0; j < actions[i].length; j++) {
                body.push(actions[i][j]);
            }
        }

        await fetch('http://localhost:5000/api/actions/', {
            method: 'POST',
            headers: { 'content-type': 'application/json', authorization: localStorage.getItem('token') },
            body: JSON.stringify(body),
        });
    };

    const handleChangeStarts = (day, index, value) => {
        for (const action of actions[day]) {
            if (value === action.starts) {
                setErrorAtIndex(day, index, 'Postoji već odredjena radnja u zadatom vremenu!');
                return;
            }
        }
        setErrorAtIndex(day, index, '');

        const temp = [...actions];
        temp[day][index].starts = value;

        for (let i = 0; i < temp[day].length - 1; i++) {
            for (let j = i + 1; j < temp[day].length; j++) {
                if (temp[day][i].starts > temp[day][j].starts && temp[day][j].starts !== '') {
                    [temp[day][i], temp[day][j]] = [temp[day][j], temp[day][i]];
                }
            }
        }

        setActions(temp);
    };

    const handleDeleteAction = (day, index) => {
        const temp = [...actions];
        temp[day].splice(index, 1);
        setActions(temp);
    };

    const handleAddAction = card_id => {
        setActions(oldVal => {
            const temp = [...oldVal];
            temp[selectedDay] = [...temp[selectedDay], { card_id, starts: '', day: selectedDay }];
            return temp;
        });
        setOverlay(false);
    };

    const handleOverlay = i => {
        setSelectedDay(i);
        setOverlay(true);
    };

    if (overlay)
        return (
            <>
                <div className='cards-column-wrapper'>
                    {cards.map(card => (
                        <CardAdd key={card.card_id} card={card} handleAddAction={() => handleAddAction(card.card_id)} />
                    ))}
                </div>
                <button onClick={() => setOverlay(false)}>Zatvori</button>
            </>
        );
    else
        return (
            <>
                <h1>
                    {userData.firstName} {userData.lastName}
                </h1>
                <p>
                    Vaš kod je <strong>{userData.code}</strong>, preuzmite aplikaciju za vaš telefon ili računar{' '}
                    <button>ovde</button> ili u vašem web pregledaču putem <Link to='/display'>ovog linka</Link>
                </p>
                <div>
                    <button onClick={handlePostActions}>Sacuvaj</button>
                    <button onClick={() => handleAuth('LOGOUT')}>Odjavi se</button>
                </div>

                <div className='cards-wrapper'>
                    {actions.map((actionsArr, day) => (
                        <div key={day}>
                            <h3>{daysOfWeek[day]}</h3>
                            <hr />
                            <div className='cards-row-wrapper'>
                                {actionsArr.map((action, index) => (
                                    <Card
                                        key={index}
                                        card={cards.find(card => card.card_id === action.card_id)}
                                        starts={action.starts}
                                        error={errors[day][index]}
                                        handleChangeStarts={value => handleChangeStarts(day, index, value)}
                                        handleDeleteAction={() => handleDeleteAction(day, index)}
                                    />
                                ))}
                                <CardPlus onClick={() => handleOverlay(day)} />
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
}
