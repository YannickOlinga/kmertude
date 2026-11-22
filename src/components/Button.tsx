import { useNavigate } from 'react-router-dom'
import './button.css'

export default function Button() {
  const navigate = useNavigate()
  return (
    <button type="button" onClick={() => navigate('/devenir-enseignant')}>Devenir Enseignant</button>
  )
}
