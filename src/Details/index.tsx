import { Link, useLocation } from 'react-router-dom'
import './style.css'

interface WantedPerson {
  title: string
  details: string
  images: Array<{
    url: string
    thumb: string
    original?: string
    large?: string
  }>
  reward_text: string
  uid: string
  caution: string
}

function Details() {
  const location = useLocation()
  const persona = location.state?.persona as WantedPerson | undefined

  if (!persona) {
    return (
      <div className="details-container">
        <p>Persona no encontrada</p>
        <Link to="/" className="back-link">← Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div className="details-container">
      <Link to="/" className="back-link">← Volver al inicio</Link>
      <h1>{persona.title}</h1>
      {persona.images && persona.images.length > 0 && (
        <div className="images-container">
          {persona.images.map((img, index) => (
            <img key={index} src={img.thumb || img.original || img.large} alt={persona.title} className="detail-image" />
          ))}
        </div>
      )}
      <div className="details-info">
        <h2>Detalles</h2>
        <p>{persona.details}</p>
        <h3>Recompensa</h3>
        <p>{persona.reward_text}</p>
        <h3>Advertencia</h3>
        <p>{persona.caution}</p>
      </div>
    </div>
  )
}

export default Details