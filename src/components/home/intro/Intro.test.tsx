import { createRoot } from 'react-dom/client'
import Intro from './Intro'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const root = createRoot(div)
  root.render(<Intro />)
  root.unmount()
})
