import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <>
            <h1>NPDO</h1>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates autem pariatur voluptatum, libero
                consequuntur eum saepe id quis alias quisquam quia quidem debitis quod vero!
            </p>
            <Link to='/login'>
                <button>Prijavi se</button>
            </Link>

            <p>
                Aplikaciju za praćenje za vaš telefon ili računar možete preuzeti <button>ovde</button> ili možete pratiti u
                vašem web pregledaču putem <Link to='/display'>ovog linka</Link>
            </p>
        </>
    );
}
