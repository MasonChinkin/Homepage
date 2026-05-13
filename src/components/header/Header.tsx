import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useIsMobile } from 'src/utils/device'
import DesktopContact from './DesktopContact'
import MobileContact from './MobileContact'
import { navLinks, navLink, navLinkSelected } from './headerStyles'

const Header = () => {
  const [scrolled, setScrolled] = useState<boolean>(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const styles = [
    navLinks.base,
    isMobile && scrolled && navLinks.withBackground,
  ]

  return (
    <header>
      <DesktopContact />
      <MobileContact />
      <section css={styles}>
        <NavLink to="/" viewTransition>
          {({ isActive }) => (
            <span css={[navLink, isActive && navLinkSelected]}>Home</span>
          )}
        </NavLink>
        <NavLink to="/about" viewTransition>
          {({ isActive }) => (
            <span css={[navLink, isActive && navLinkSelected]}>About</span>
          )}
        </NavLink>
        <NavLink to="/d3" viewTransition>
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
