import { Global } from '@emotion/react'
import { useEffect } from 'react'
import Header from './Header'
import Visualization from './components/budget-sankey/Visualization'
import { budgetSankeyStyles } from './components/budget-sankey/budgetSankeyStyles'
import initializeViz from './components/budget-sankey/vizScript'
import LegacyStyles from './styles/legacyStyles'

export const Component = () => {
  useEffect(() => {
    initializeViz()
  }, [])

  return (
    <>
      <LegacyStyles />
      <Global styles={budgetSankeyStyles} />
      <div className="legacy">
        <Header title="Federal Budget Sankey" />
        <main>
          <Visualization />
        </main>
      </div>
    </>
  )
}
