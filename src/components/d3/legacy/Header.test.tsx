import { render, screen } from '@testing-library/react'
import { Router } from 'wouter'
import LegacyHeader from './Header'

it('renders the title', () => {
  render(
    <Router>
      <LegacyHeader title="Test Visualization" />
    </Router>
  )
  expect(
    screen.getByRole('heading', { name: /test visualization/i })
  ).toBeInTheDocument()
})

it('renders a Back button', () => {
  render(
    <Router>
      <LegacyHeader title="Test" />
    </Router>
  )
  expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
})
