import { createRoot } from 'react-dom/client'
import D3ProjectGrid from './D3ProjectGrid'
import OtherProjectGrid from './OtherProjectGrid'

it('D3ProjectGrid renders without crashing', () => {
  const div = document.createElement('div')
  const root = createRoot(div)
  root.render(<D3ProjectGrid />)
  root.unmount()
})

it('OtherProjectGrid renders without crashing', () => {
  const div = document.createElement('div')
  const root = createRoot(div)
  root.render(<OtherProjectGrid />)
  root.unmount()
})
