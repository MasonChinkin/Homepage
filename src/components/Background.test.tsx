import { render } from '@testing-library/react'
import Background from './Background'

it('renders three star layers', () => {
  const { container } = render(<Background />)
  expect(container.querySelectorAll('div')).toHaveLength(3)
})
