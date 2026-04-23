import './style.css'
import poster from '../assets/image.png'

function Informativa(){
    return(
        <div className="poster-container">
            <h1>Página Informativa</h1>

            <img 
                src={poster} 
                alt="Poster Royal Flush Heist" 
                className="poster-image"
            />

            <p>Información sobre el sitio y sus funcionalidades.</p>
            <ul>
                <li>Buscar personas buscadas por el FBI</li>
                <li>Agregar a favoritos</li>
                <li>Ver detalles</li>
            </ul>
        </div>
    )
}

export default Informativa