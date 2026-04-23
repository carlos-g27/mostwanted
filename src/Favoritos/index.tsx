import { useState, useEffect } from 'react'
import './style.css'

interface WantedPerson {
  title: string
  details: string
  images: Array<{
    url: string
    thumb: string
  }>
  reward_text: string
  uid: string
  caution: string
}

function Favoritos() {
  const [favorites, setFavorites] = useState<WantedPerson[]>([])

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(favs)
  }, [])

  const removeFromFavorites = (uid: string) => {
    const newFavs = favorites.filter(f => f.uid !== uid)
    setFavorites(newFavs)
    localStorage.setItem('favorites', JSON.stringify(newFavs))
  }

  return (
    <>
      <h1>Favoritos</h1>
      <div className="personas-container">
        {favorites.length > 0 ? (
          favorites.map((persona) => (
            <div key={persona.uid} className="persona-card">
              <div className="persona-item">
                {persona.images && persona.images.length > 0 && (
                  <div className="imagen-container">
                    {persona.images.map((img, index) => (
                      <img key={index} src={img.thumb || img.original || img.large} alt={persona.title} className="persona-imagen" />
                    ))}
                  </div>
                )}
                <div className="persona-info">
                  <h3 className="persona-titulo">{persona.title}</h3>
                  <p className="persona-detalles">{persona.details.substring(0, 150)}...</p>
                  <p className="persona-recompensa">
                    <strong>Recompensa:</strong> {persona.reward_text}
                  </p>
                  <button onClick={() => removeFromFavorites(persona.uid)} className="remove-fav-btn">Remover de Favoritos</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="sin-resultados">No tienes favoritos aún</p>
        )}
      </div>
    </>
  )
}

export default Favoritos