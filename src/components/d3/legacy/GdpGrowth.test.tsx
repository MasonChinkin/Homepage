import { render } from '@testing-library/react'
import { Router } from 'wouter'

vi.mock('./components/gdp-growth/vizScript')

it('renders without crashing', async () => {
  const { Component } = await import('./GdpGrowth')
  render(
    <Router>
      <Component />
    </Router>
  )
})
