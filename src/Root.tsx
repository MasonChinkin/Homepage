import { Suspense, lazy } from 'react'
import { Route, Switch } from 'wouter'

const Profile = lazy(() =>
  import('./components/Profile').then((m) => ({ default: m.Component }))
)
const RedditVisualization = lazy(() =>
  import('./components/d3/legacy/RedditVisualization').then((m) => ({
    default: m.Component,
  }))
)
const BudgetSankey = lazy(() =>
  import('./components/d3/legacy/BudgetSankey').then((m) => ({
    default: m.Component,
  }))
)
const SyriaNetwork = lazy(() =>
  import('./components/d3/legacy/SyriaNetwork').then((m) => ({
    default: m.Component,
  }))
)
const ForceCluster = lazy(() =>
  import('./components/d3/legacy/ForceCluster').then((m) => ({
    default: m.Component,
  }))
)
const CongressMap = lazy(() =>
  import('./components/d3/legacy/CongressMap').then((m) => ({
    default: m.Component,
  }))
)
const GdpGrowth = lazy(() =>
  import('./components/d3/legacy/GdpGrowth').then((m) => ({
    default: m.Component,
  }))
)
const D3Template = lazy(() =>
  import('./components/d3/template/D3Template').then((m) => ({
    default: m.Component,
  }))
)

const Root = () => (
  <Suspense fallback={null}>
    <Switch>
      <Route path="/reddit-visualization" component={RedditVisualization} />
      <Route path="/budget-sankey" component={BudgetSankey} />
      <Route path="/syria-network" component={SyriaNetwork} />
      <Route path="/force-cluster" component={ForceCluster} />
      <Route path="/congress-map" component={CongressMap} />
      <Route path="/gdp-growth" component={GdpGrowth} />
      <Route path="/d3/template" component={D3Template} />
      <Route component={Profile} />
    </Switch>
  </Suspense>
)

export default Root
