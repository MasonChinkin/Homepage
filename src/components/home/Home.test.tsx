import { createRoot } from 'react-dom/client'
import Home from './Home'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const root = createRoot(div)
  root.render(<Home />)
  root.unmount()
})
