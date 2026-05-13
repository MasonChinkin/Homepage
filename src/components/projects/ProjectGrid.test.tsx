import { render, screen } from '@testing-library/react'
import { Router } from 'wouter'
import D3ProjectGrid from './D3ProjectGrid'

it('renders all project cards', () => {
  render(
    <Router>
      <D3ProjectGrid />
    </Router>
  )
  expect(screen.getAllByRole('button')).toHaveLength(6)
})
