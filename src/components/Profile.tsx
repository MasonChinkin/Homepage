import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import budgetSankeyWebp from 'src/static/animated/budget-sankey.webp'
import redditWebp from 'src/static/animated/reddit-visualization.webp'
import avatarImg from 'src/static/images/avatar.jpg'
import budgetSankeyImg from 'src/static/images/budget-dashboard.jpg'
import networkImg from 'src/static/images/network.png'
import redditImg from 'src/static/images/reddit-visualization.png'
import Background from './Background'
import About from './about/About'
import Header from './header/Header'
import Home from './home/Home'
import D3ProjectGrid from './projects/D3ProjectGrid'

type RouteObj = {
  path: string
  element: React.ReactElement
}

export const Component = () => {
  const routes: RouteObj[] = [
    { path: '/', element: <Home /> },
    { path: '/about', element: <About /> },
    { path: '/d3', element: <D3ProjectGrid /> },
    { path: '/*', element: <Navigate to="/" /> },
  ]

  const location = useLocation()

  // Preload critical images for home page using native browser preloading
  useEffect(() => {
    const imagesToPreload = [
      avatarImg,
      redditWebp,
      redditImg,
      budgetSankeyWebp,
      budgetSankeyImg,
      networkImg,
    ]

    const links: HTMLLinkElement[] = []

    imagesToPreload.forEach((src) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
      links.push(link)
    })

    // Cleanup: remove preload links when component unmounts
    return () => {
      links.forEach((link) => document.head.removeChild(link))
    }
  }, [])

  return (
    <>
      <Background />
      <Header />

      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Routes location={location}>
            {routes.map((route) => (
              <Route
                key={location.pathname}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </motion.div>
      </AnimatePresence>
    </>
  )
}
