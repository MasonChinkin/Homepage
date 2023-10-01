import { createRoot } from 'react-dom/client'
import FeaturedProjects from './FeaturedProjects'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const root = createRoot(div)
  root.render(<FeaturedProjects />)
  root.unmount()
})
