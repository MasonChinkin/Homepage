import { render, screen } from '@testing-library/react'
import Intro from './Intro'

it('renders name heading', () => {
  render(<Intro />)
  expect(
    screen.getByRole('heading', { name: /mason chinkin/i })
  ).toBeInTheDocument()
})
