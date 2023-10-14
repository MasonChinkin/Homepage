import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './components/App'
import FederalBudgetSankey from './components/d3/legacy/FederalBudgetSankey'
import RedditVisualization from './components/d3/legacy/RedditVisualization'

const Root = () => {
  const legacyProjects = [
    { path: '/legacy/reddit-visualization', element: <RedditVisualization /> },
    { path: '/legacy/federal-budget-sankey', element: <FederalBudgetSankey /> },
  ]

  return (
    <BrowserRouter>
      <Routes>
        {legacyProjects.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Root
