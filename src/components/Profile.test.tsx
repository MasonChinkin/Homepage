import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Profile from './Profile'

const component = (
  <BrowserRouter>
    <Profile />
  </BrowserRouter>
)

it('renders without crashing', () => {
  const div = document.createElement('div')
  const root = createRoot(div)
  root.render(component)
  root.unmount()
})
