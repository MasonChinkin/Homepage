import { render } from '@testing-library/react'
import { Router } from 'wouter'

vi.mock('./components/congress-map/vizScript')

it('renders without crashing', async () => {
  const { Component } = await import('./CongressMap')
  render(
    <Router>
      <Component />
    </Router>
  )
})
