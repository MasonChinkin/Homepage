import React from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
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
