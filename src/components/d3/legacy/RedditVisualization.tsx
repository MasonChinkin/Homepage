import { useEffect } from 'react'
import 'src/components/d3/legacy/styles/globals.scss'
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
      <Header title="Reddit Visualization" />
      <main>
        <Instructions />
        <Inputs />
        <Visualization />
      </main>
    </div>
  )
}

export default RedditVisualization
