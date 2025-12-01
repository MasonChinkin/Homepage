import { Global } from '@emotion/react'
import { useEffect } from 'react'
import Header from './Header'
import Visualization from './components/gdp-growth/Visualization'
import { gdpGrowthStyles } from './components/gdp-growth/gdpGrowthStyles'
import initializeViz from './components/gdp-growth/vizScript'
import LegacyStyles from './styles/legacyStyles'

export const Component = () => {
  useEffect(() => {
    initializeViz()
  }, [])

  return (
    <>
      <LegacyStyles />
      <Global styles={gdpGrowthStyles} />
      <div className="legacy">
        <Header title="Contributions to Annual US GDP Growth" />
        <main>
          <Visualization />
        </main>
      </div>
    </>
  )
}
