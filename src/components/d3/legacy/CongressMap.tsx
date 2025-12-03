import { Global } from '@emotion/react'
import { useEffect } from 'react'
import Header from './Header'
import Visualization from './components/congress-map/Visualization'
import { congressMapStyles } from './components/congress-map/congressMapStyles'
import initializeViz from './components/congress-map/vizScript'
import LegacyStyles from './styles/legacyStyles'

export const Component = () => {
  useEffect(() => {
    initializeViz()
  }, [])

  return (
    <>
      <LegacyStyles />
      <Global styles={congressMapStyles} />
      <div className="legacy">
        <Header title="2016 Congressional Election" />
        <main>
          <Visualization />
        </main>
      </div>
    </>
  )
}
