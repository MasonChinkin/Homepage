import { useEffect } from 'react'
import Footer from './Footer'
import Header from './Header'
import Inputs from './components/reddit-visualization/components/Inputs'
import Instructions from './components/reddit-visualization/components/Instructions'
import Visualization from './components/reddit-visualization/components/Visualization'
import initializeViz from './components/reddit-visualization/vizScript'

const RedditVisualization = () => {
  useEffect(() => {
    initializeViz()
  }, [])

  return (
    <div className="legacy">
      <Header title="Federal Budget Sankey" />
      <main>
        <Instructions />
        <Inputs />
        <Visualization />
      </main>
      <Footer />
    </div>
  )
}

export default RedditVisualization
