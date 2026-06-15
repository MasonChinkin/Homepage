import { render } from '@testing-library/react'
import { Router } from 'wouter'

vi.mock('./components/reddit-visualization/vizScript')

it('renders without crashing', async () => {
  const { Component } = await import('./RedditVisualization')
  render(
    <Router>
      <Component />
    </Router>
  )
})
