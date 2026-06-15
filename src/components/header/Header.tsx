import { useState, useEffect } from 'react'
import { useIsMobile } from 'src/utils/device'
import { useLocation, useRoute } from 'wouter'
import DesktopContact from './DesktopContact'
import MobileContact from './MobileContact'
import { navLinks, navLink, navLinkSelected } from './headerStyles'

const NavLink = ({ to, label }: { to: string; label: string }) => {
  const [isActive] = useRoute(to)
  const [, setLocation] = useLocation()

  const navigate = (e: React.MouseEvent) => {
    e.preventDefault()
    if (
      typeof document !== 'undefined' &&
      typeof document.startViewTransition === 'function'
    ) {
      document.startViewTransition(() => setLocation(to))
    } else {
      setLocation(to)
    }
  }

  return (
    <a href={to} onClick={navigate}>
      <span css={[navLink, isActive && navLinkSelected]}>{label}</span>
    </a>
  )
}

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
    <header css={{ viewTransitionName: 'site-header' }}>
      <DesktopContact />
      <MobileContact />
      <section css={styles}>
        <NavLink to="/" label="Home" />
        <NavLink to="/about" label="About" />
        <NavLink to="/d3" label="D3 Projects" />
      </section>
    </header>
  )
}

export default Header
