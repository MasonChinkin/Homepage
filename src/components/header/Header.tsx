import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import DesktopContact from './DesktopContact'
import MobileContact from './MobileContact'
import { navLinks } from './headerStyles'

const Header = () => {
  const [scrolled, setScrolled] = useState<boolean>(false)
  const isMobile: boolean = window.innerWidth <= 768

  useEffect((): void => {
    window.addEventListener('scroll', () => {
      setScrolled(window.scrollY > 0)
    })
  }, [setScrolled])

  const styles = [
    navLinks.base,
    isMobile && scrolled && navLinks.withBackground,
  ]

  return (
    <header>
      <DesktopContact />
      <MobileContact />
      <section css={styles}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'selected' : '')}
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) => (isActive ? 'selected' : '')}
        >
          About
        </NavLink>
        <NavLink
          to="/d3"
          className={({ isActive }) => (isActive ? 'selected' : '')}
        >
          D3 Projects
        </NavLink>
      </section>
    </header>
  )
}

export default Header
