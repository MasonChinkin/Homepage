import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Profile from './components/Profile'
import RedditVisualization from './components/d3/legacy/RedditVisualization'

const Root = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<Profile />} />
        <Route path="/reddit-visualization" element={<RedditVisualization />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Root
