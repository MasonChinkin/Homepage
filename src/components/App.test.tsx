import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

const component = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

it('renders without crashing', () => {
  const div = document.createElement('div')
  const root = createRoot(div)
  root.render(component)
  root.unmount()
})
