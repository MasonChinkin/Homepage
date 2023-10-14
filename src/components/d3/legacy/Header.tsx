type HeaderProps = { title: string }

const Header = ({ title }: HeaderProps) => {
  return (
    <header>
      <h1>{title}</h1>
      <a href="https://masonchinkin.com/d3">
        <i className="fas fa-long-arrow-alt-left" /> Back
      </a>
    </header>
  )
}

export default Header
