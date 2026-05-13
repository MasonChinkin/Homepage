import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
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

  return (
    <>
      <Background />
      <Header />
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </>
  )
}
