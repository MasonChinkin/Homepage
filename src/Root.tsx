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
        <Route
          path="/budget-sankey"
          HydrateFallback={() => null}
          lazy={() => import('./components/d3/legacy/BudgetSankey')}
        />
        <Route
          path="/syria-network"
          HydrateFallback={() => null}
          lazy={() => import('./components/d3/legacy/SyriaNetwork')}
        />
        <Route
          path="/force-cluster"
          HydrateFallback={() => null}
          lazy={() => import('./components/d3/legacy/ForceCluster')}
        />
        <Route
          path="/congress-map"
          HydrateFallback={() => null}
          lazy={() => import('./components/d3/legacy/CongressMap')}
        />
      </>
    )
  )

  return <RouterProvider router={router} />
}

export default Root
