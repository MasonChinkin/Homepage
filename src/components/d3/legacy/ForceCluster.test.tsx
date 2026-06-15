import { render } from '@testing-library/react'
import { Router } from 'wouter'

vi.mock('./components/force-cluster/vizScript')

it('renders without crashing', async () => {
  const { Component } = await import('./ForceCluster')
  render(
    <Router>
      <Component />
    </Router>
  )
})
