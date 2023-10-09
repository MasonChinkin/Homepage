import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Header from './Header'

const component = (
  <BrowserRouter>
    <Header />
  </BrowserRouter>
)

it('renders without crashing', () => {
  const div = document.createElement('div')
  const root = createRoot(div)
  root.render(component)
  root.unmount()
})
