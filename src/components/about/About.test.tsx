import { createRoot } from 'react-dom/client'
import About from './About'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const root = createRoot(div)
  root.render(<About />)
  root.unmount()
})
