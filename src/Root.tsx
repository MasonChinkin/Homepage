import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom'
import Profile from './components/Profile'
import RedditVisualization from './components/d3/legacy/RedditVisualization'

const Root = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/*" element={<Profile />} />
        <Route path="/reddit-visualization" element={<RedditVisualization />} />
      </>
    )
  )

  return <RouterProvider router={router} />
}

export default Root
