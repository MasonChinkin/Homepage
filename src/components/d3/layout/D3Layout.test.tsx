import { render, screen } from '@testing-library/react'
import { Router } from 'wouter'
import D3Layout from './D3Layout'

it('renders the visualization title', () => {
  render(
    <Router>
      <D3Layout title="My Chart">
        <div>viz</div>
      </D3Layout>
    </Router>
  )
  expect(screen.getByText('My Chart')).toBeInTheDocument()
})

it('renders a back button', () => {
  render(
    <Router>
      <D3Layout title="Chart">
        <div />
      </D3Layout>
    </Router>
  )
  expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument()
})

it('renders a theme toggle button', () => {
  render(
    <Router>
      <D3Layout title="Chart">
        <div />
      </D3Layout>
    </Router>
  )
  // The theme toggle has role="button" but no text label; verify two buttons exist
  const buttons = screen.getAllByRole('button')
  expect(buttons).toHaveLength(2)
})
