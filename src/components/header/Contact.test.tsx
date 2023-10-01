import { createRoot } from 'react-dom/client'
import DesktopContact from './DesktopContact'
import MobileContact from './MobileContact'

it('renders without crashing', () => {
  const div = document.createElement('div')
  const root = createRoot(div)
  root.render(<DesktopContact />)
  root.unmount()
})

it('renders without crashing', () => {
  const div = document.createElement('div')
  const root = createRoot(div)
  root.render(<MobileContact />)
  root.unmount()
})
