import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import D3ProjectGrid from './D3ProjectGrid'

it('renders all project cards', () => {
  render(
    <MemoryRouter>
      <D3ProjectGrid />
    </MemoryRouter>
  )
  expect(screen.getAllByRole('button')).toHaveLength(6)
})
