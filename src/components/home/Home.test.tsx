import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from './Home'

it('renders home page content', () => {
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
  expect(
    screen.getByRole('heading', { name: /mason chinkin/i })
  ).toBeInTheDocument()
})
