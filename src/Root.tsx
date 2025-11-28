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
          lazy={() => import('./components/Profile')}
          HydrateFallback={() => null}
        />
        <Route
          path="/reddit-visualization"
          lazy={() => import('./components/d3/legacy/RedditVisualization')}
          HydrateFallback={() => null}
        />
        <Route
          path="/budgetSankey"
          lazy={() => import('./components/d3/legacy/BudgetSankeyVisualization')}
          HydrateFallback={() => null}
        />
      </>
    )
  )

  return <RouterProvider router={router} />
}

export default Root
