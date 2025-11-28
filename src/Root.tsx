import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'

const Root = () => {
  console.log('Root component rendered')
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/*" lazy={() => import('./components/Profile')} />
        <Route
          path="/reddit-visualization"
          lazy={() => import('./components/d3/legacy/RedditVisualization')}
        />
      </>
    )
  )

  return <RouterProvider router={router} />
}

export default Root
