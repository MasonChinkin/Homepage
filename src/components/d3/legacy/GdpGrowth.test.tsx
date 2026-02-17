import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('./components/gdp-growth/vizScript')

it('renders without crashing', async () => {
  const { Component } = await import('./GdpGrowth')
  render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>
  )
})
