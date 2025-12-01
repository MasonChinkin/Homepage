import { Global } from '@emotion/react'
import { useEffect } from 'react'
import Header from './Header'
import Visualization from './components/force-cluster/Visualization'
import { forceClusterStyles } from './components/force-cluster/forceClusterStyles'
import initializeViz from './components/force-cluster/vizScript'
import LegacyStyles from './styles/legacyStyles'

export const Component = () => {
  useEffect(() => {
    initializeViz()
  }, [])

  return (
    <>
      <LegacyStyles />
      <Global styles={forceClusterStyles} />
      <div className="legacy">
        <Header title="Force Cluster Animation" />
        <main>
          <Visualization />
        </main>
      </div>
    </>
  )
}
