import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import "./style.css";

interface WantedPerson {
  title: string
  details: string
  images: Array<{
    original: string;
    url: string
    thumb: string
    original?: string
    large?: string
  }>
  reward_text: string
  uid: string
  caution: string
}

type FiltroTipo = 'titulo' | 'detalles' | 'recompensa'


function Home() {
  const [wanted, setWanted] = useState<WantedPerson[]>([])
  const [filtro, setFiltro] = useState<FiltroTipo>('titulo')
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const filtros: FiltroTipo[] = ['titulo', 'detalles', 'recompensa'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCargando(true)
        const res = await fetch('https://api.fbi.gov/wanted/v1/list')
        const data = await res.json()

        // Filtrar y mapear solo los campos requeridos
        const personasBuscadas = data.items
          .filter((person: any) => person.title && person.images && person.images.length > 0)
          .map((person: any) => ({
            uid: person.uid,
            title: person.title || '',
            details: person.description || '',
            images: person.images || [],
            reward_text: person.reward_text || 'Sin recompensa especificada',
            caution: person.caution || 'Sin advertencia específica'
          }))

        setWanted(personasBuscadas)
        setError('')
      } catch (error) {
        console.error('Error cargando datos:', error)
        setError('Error al cargar los datos del FBI')
      } finally {
        setCargando(false)
      }
    }

    fetchData()
  }, [])

  const addToFavorites = (persona: WantedPerson) => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    if (!favorites.find((f: WantedPerson) => f.uid === persona.uid)) {
      favorites.push(persona)
      localStorage.setItem('favorites', JSON.stringify(favorites))
      alert('Agregado a favoritos')
    } else {
      alert('Ya está en favoritos')
    }
  }

  const personasFiltradas = wanted.filter((persona) => {
    if (busqueda.length < 2) return true

    const busquedaLower = busqueda.toLowerCase()

    switch (filtro) {
      case 'titulo':
        return persona.title.toLowerCase().includes(busquedaLower)
      case 'detalles':
        return persona.details.toLowerCase().includes(busquedaLower)
      case 'recompensa':
        return persona.reward_text.toLowerCase().includes(busquedaLower)
      default:
        return true
    }
  })

  return (
    <>
      <div className="filtros">
        <h2>Buscar por:</h2>
        {filtros.map((filtroOpcion) => (
          <button
            key={filtroOpcion}
            onClick={() => setFiltro(filtroOpcion)}
            className={filtro === filtroOpcion ? 'activo' : ''}
          >
            {filtroOpcion.charAt(0).toUpperCase() + filtroOpcion.slice(1)}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder={`Buscar por ${filtro}...`}
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {cargando && <p className="cargando">Cargando personas buscadas...</p>}
      {error && <p className="error">{error}</p>}

      <div className="personas-container">
        {personasFiltradas.length > 0 ? (
          personasFiltradas.map((persona) => (
            <Link key={persona.uid} to={`/detalles/${persona.uid}`} state={{ persona }} className="persona-card">
              <div className="persona-item">
                {persona.images && persona.images.length > 0 && (
                  <div className="imagen-container">
                    <img 
                      src={persona.images[0].thumb || persona.images[0].original || persona.images[0].large} 
                      alt={persona.title}
                      className="persona-imagen"
                    />
                  </div>
                )}
                <div className="persona-info">
                  <h3 className="persona-titulo">{persona.title}</h3>
                  <p className="persona-detalles">{persona.details.substring(0, 150)}...</p>
                  <p className="persona-recompensa">
                    <strong>Recompensa:</strong> {persona.reward_text}
                  </p>
                  <button onClick={(e) => { e.preventDefault(); addToFavorites(persona) }} className="add-fav-btn">Agregar a Favoritos</button>
                </div>
              </div>
            </Link>
            /*coomentt*/
            /*COMMENT*/  
            /*COMMENT1*/  
          ))
        ) : (
          <p className="sin-resultados">No se encontraron resultados</p>
        )}
      </div>
    </>
  )
}

export default Home