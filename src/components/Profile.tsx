import ReactCSSTransitionReplace from 'react-css-transition-replace'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Background from './Background'
import About from './about/About'
import Header from './header/Header'
import Home from './home/Home'
import D3ProjectGrid from './projects/D3ProjectGrid'

type RouteObj = {
  path: string
  element: JSX.Element
}

const Profile = () => {
  const routes: RouteObj[] = [
    { path: '/', element: <Home /> },
    { path: '/about', element: <About /> },
    { path: '/d3', element: <D3ProjectGrid /> },
    { path: '/*', element: <Navigate to="/" /> },
  ]

  const location = useLocation()
  const transitionDuration: number = 500 // matching value in base.scss

  return (
    <>
      <Background />
      <Header />

      {/* @ts-expect-error async component throws type error */}
      <ReactCSSTransitionReplace
        transitionName="fade-wait"
        transitionEnterTimeout={transitionDuration}
        transitionLeaveTimeout={transitionDuration}
      >
        <div key={location.pathname}>
          <Routes location={location}>
            {routes.map((route, i) => (
              <Route
                key={location.pathname}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </div>
      </ReactCSSTransitionReplace>
    </>
  )
}

export default Profile
