import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('./components/congress-map/vizScript')

it('renders without crashing', async () => {
  const { Component } = await import('./CongressMap')
  render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>
  )
})
