import { useEffect } from 'react'
import 'src/components/d3/legacy/styles/globals.scss'
import Header from './Header'
import Visualization from './components/budget-sankey/components/Visualization'
import initializeViz from './components/budget-sankey/vizScript'

export const Component = () => {
  useEffect(() => {
    initializeViz()
  }, [])

  return (
    <div className="legacy">
      <Header title="Federal Budget Sankey" />
      <main>
        <Visualization />
      </main>
    </div>
  )
}
