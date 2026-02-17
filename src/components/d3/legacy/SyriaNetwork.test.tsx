import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('./components/syria-network/vizScript')

it('renders without crashing', async () => {
  const { Component } = await import('./SyriaNetwork')
  render(
    <MemoryRouter>
      <Component />
    </MemoryRouter>
  )
})
