import { useEffect } from 'react'
import Header from './Header'
import Inputs from './components/reddit-visualization/components/Inputs'
import Instructions from './components/reddit-visualization/components/Instructions'
import Visualization from './components/reddit-visualization/components/Visualization'
import initializeViz from './components/reddit-visualization/vizScript'
import LegacyStyles from './styles/legacyStyles'

export const Component = () => {
  useEffect(() => {
    initializeViz()
  }, [])

  return (
    <>
      <LegacyStyles />
      <div className="legacy">
        <Header title="Reddit Visualization" />
        <main>
          <Instructions />
          <Inputs />
          <Visualization />
        </main>
      </div>
    </>
  )
}
