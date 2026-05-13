import { useNavigate } from 'react-router-dom'
import { LongArrowLeft } from 'src/components/ui/icons'

type HeaderProps = { title: string }

const Header = ({ title }: HeaderProps) => {
  const navigate = useNavigate()

  return (
    <header>
      <h1>{title}</h1>
      <button
        css={{ cursor: 'pointer' }}
        onClick={() => navigate('/d3')}
        type="button"
      >
        <LongArrowLeft aria-label="Back" /> Back
      </button>
    </header>
  )
}

export default Header
