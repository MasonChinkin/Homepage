import { Global } from '@emotion/react'
import { useEffect } from 'react'
import Header from './Header'
import Visualization from './components/syria-network/Visualization'
import { syriaNetworkStyles } from './components/syria-network/syriaNetworkStyles'
import initializeViz from './components/syria-network/vizScript'
import LegacyStyles from './styles/legacyStyles'

export const Component = () => {
  useEffect(() => {
    initializeViz()
  }, [])

  return (
    <>
      <LegacyStyles />
      <Global styles={syriaNetworkStyles} />
      <div className="legacy">
        <Header title="Diplomatic Web in 2014 Syria" />
        <main>
          <Visualization />
        </main>
      </div>
    </>
  )
}
