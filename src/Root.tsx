import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'

const Root = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/*"
          HydrateFallback={() => null}
          lazy={() => import('./components/Profile')}
        />
        <Route
          path="/reddit-visualization"
          HydrateFallback={() => null}
          lazy={() => import('./components/d3/legacy/RedditVisualization')}
        />
      </>
    )
  )

  return <RouterProvider router={router} />
}

export default Root
