import { useNavigate } from 'react-router-dom'

type HeaderProps = { title: string }

const Header = ({ title }: HeaderProps) => {
  const navigate = useNavigate()

  return (
    <header>
      <h1>{title}</h1>
      <button onClick={() => navigate('/')} type="button">
        <i className="fas fa-long-arrow-alt-left" /> Back
      </button>
    </header>
  )
}

export default Header
