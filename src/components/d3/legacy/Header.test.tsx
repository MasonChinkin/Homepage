import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LegacyHeader from './Header'

it('renders the title', () => {
  render(
    <MemoryRouter>
      <LegacyHeader title="Test Visualization" />
    </MemoryRouter>
  )
  expect(
    screen.getByRole('heading', { name: /test visualization/i })
  ).toBeInTheDocument()
})

it('renders a Back button', () => {
  render(
    <MemoryRouter>
      <LegacyHeader title="Test" />
    </MemoryRouter>
  )
  expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
})
