import { render, screen } from '@testing-library/react'
import About from './About'

it('renders About Me heading', () => {
  render(<About />)
  expect(screen.getByRole('heading', { name: /about me/i })).toBeInTheDocument()
})
