import { render, screen } from '@testing-library/react'
import { Router } from 'wouter'
import Home from './Home'

it('renders home page content', () => {
  render(
    <Router>
      <Home />
    </Router>
  )
  expect(
    screen.getByRole('heading', { name: /mason chinkin/i })
  ).toBeInTheDocument()
})
