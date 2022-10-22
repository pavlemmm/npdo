import './Card.scss';


export const Card = ({ card, starts, error, handleChangeStarts, handleDeleteAction }) => {
    return (
        <div className='card'>
            <h3>{card.name}</h3>
            <div>
                <div>
                    <label>Početak radnje: </label>
                    <input type='time' value={starts} onChange={e => handleChangeStarts(e.target.value)} />
                </div>
                {error}
                <button onClick={handleDeleteAction}>Obriši</button>
            </div>
        </div>
    );
};

export const CardAdd = ({ card, handleAddAction }) => {
    return (
        <div className='card'>
            <h4>{card.name}</h4>
            <button onClick={handleAddAction}>Dodaj</button>
        </div>
    );
};

export const CardPlus = ({ onClick }) => {
    return (
        <div className='card card-plus' onClick={onClick}>
            +
        </div>
    );
};
