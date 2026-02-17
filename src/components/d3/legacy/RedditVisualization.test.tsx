import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('./components/reddit-visualization/vizScript')

it('renders without crashing', async () => {
  const { Component } = await import('./RedditVisualization')
  render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>
  )
})
