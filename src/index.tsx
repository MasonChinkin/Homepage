import { createRoot } from 'react-dom/client'
import Root from './Root'
import GlobalStyles from './styles/GlobalStyles'

const domNode = document.getElementById('root')!
const root = createRoot(domNode)

root.render(
  <>
    <GlobalStyles />
    <Root />
  </>
)
