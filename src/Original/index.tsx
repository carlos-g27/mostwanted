import { useState, useEffect } from 'react'
import './style.css'

interface WantedPerson {
  uid: string
  title: string
  details: string
  reward_text: string
  images: Array<{ url: string; thumb: string }>
}

function Original() {
  const [persona, setPersona] = useState<WantedPerson | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const fetchOriginalPerson = async () => {
    try {
      setCargando(true)
      const res = await fetch('https://api.fbi.gov/@wanted')
      const data = await res.json()
      const items = data.items || []
      if (items.length === 0) {
        setError('No se encontró información original')
        return
      }

      const randomIndex = Math.floor(Math.random() * items.length)
      const person = items[randomIndex]
      setPersona({
        uid: person.uid,
        title: person.title || 'Título no disponible',
        details: person.details || 'Detalles no disponibles',
        reward_text: person.reward_text || 'Sin recompensa especificada',
        images: person.images || []
      })
      setError('')
    } catch (fetchError) {
      console.error('Error cargando datos originales:', fetchError)
      setError('No se pudieron cargar los datos originales')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    fetchOriginalPerson()
  }, [])

  return (
    <section className="original-page">
      <h1>Página Original</h1>
      <p>Esta sección trae un caso original desde la API del FBI.</p>

      {cargando && <p>Cargando caso original...</p>}
      {error && <p className="error">{error}</p>}

      {persona && (
        <article className="case-card">
          <h2>{persona.title}</h2>
          <p>{persona.details}</p>
          <p>
            <strong>Recompensa:</strong> {persona.reward_text}
          </p>
          {persona.images.length > 0 && (
            <img
              src={persona.images[0].thumb || persona.images[0].url}
              alt={persona.title}
              className="case-image"
            />
          )}
          <button onClick={fetchOriginalPerson} className="refresh-btn">
            Mostrar otro caso original
          </button>
        </article>
      )}
    </section>
  )
}

export default Original