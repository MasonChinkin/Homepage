import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('./components/force-cluster/vizScript')

it('renders without crashing', async () => {
  const { Component } = await import('./ForceCluster')
  render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>
  )
})
