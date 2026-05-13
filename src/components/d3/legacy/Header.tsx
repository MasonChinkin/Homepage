import { LongArrowLeft } from 'src/components/ui/icons'
import { useLocation } from 'wouter'

type HeaderProps = { title: string }

const Header = ({ title }: HeaderProps) => {
  const [, setLocation] = useLocation()

  return (
    <header>
      <h1>{title}</h1>
      <button
        css={{ cursor: 'pointer' }}
        onClick={() => setLocation('/d3')}
        type="button"
      >
        <LongArrowLeft aria-label="Back" /> Back
      </button>
    </header>
  )
}

export default Header
