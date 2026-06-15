import { render, screen } from '@testing-library/react'
import { Router } from 'wouter'

vi.mock('d3')

it('renders D3 Template Project title', async () => {
  const { Component } = await import('./D3Template')
  render(
    <Router>
      <Component />
    </Router>
  )
  expect(screen.getByText(/d3 template project/i)).toBeInTheDocument()
})
