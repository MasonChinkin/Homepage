import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import DesktopContact from './DesktopContact'
import MobileContact from './MobileContact'
import { navLinks, navLink, navLinkSelected } from './headerStyles'

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
        <NavLink to="/">
          {({ isActive }) => (
            <span css={[navLink, isActive && navLinkSelected]}>Home</span>
          )}
        </NavLink>
        <NavLink to="/about">
          {({ isActive }) => (
            <span css={[navLink, isActive && navLinkSelected]}>About</span>
          )}
        </NavLink>
        <NavLink to="/d3">
          {({ isActive }) => (
            <span css={[navLink, isActive && navLinkSelected]}>
              D3 Projects
            </span>
          )}
        </NavLink>
      </section>
    </header>
  )
}

export default Header
