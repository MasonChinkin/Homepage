import { createRoot } from 'react-dom/client'
import FeaturedProjectItem from './FeaturedProjectItem'
import { d3Projects } from '../../projects/projectList'

const project = d3Projects[0]

it('renders without crashing', () => {
  const div = document.createElement('div')
  const root = createRoot(div)
  root.render(<FeaturedProjectItem project={project} />)
  root.unmount()
})
