import { render } from '@testing-library/react'
import Background from './Background'

it('renders three star layers wrapped in a positioning div', () => {
  const { container } = render(<Background />)
  // Outer wrapper + three star layers
  expect(container.querySelectorAll('div')).toHaveLength(4)
})
