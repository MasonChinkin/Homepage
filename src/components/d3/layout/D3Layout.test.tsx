import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import D3Layout from './D3Layout'

it('renders the visualization title', () => {
  render(
    <MemoryRouter>
      <D3Layout title="My Chart">
        <div>viz</div>
      </D3Layout>
    </MemoryRouter>
  )
  expect(screen.getByText('My Chart')).toBeInTheDocument()
})

it('renders a back button', () => {
  render(
    <MemoryRouter>
      <D3Layout title="Chart">
        <div />
      </D3Layout>
    </MemoryRouter>
  )
  expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
})

it('renders a theme toggle button', () => {
  render(
    <MemoryRouter>
      <D3Layout title="Chart">
        <div />
      </D3Layout>
    </MemoryRouter>
  )
  // The theme toggle has role="button" but no text label; verify two buttons exist
  const buttons = screen.getAllByRole('button')
  expect(buttons).toHaveLength(2)
})
