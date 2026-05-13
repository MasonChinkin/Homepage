import { render } from '@testing-library/react'
import { Router } from 'wouter'

vi.mock('./components/syria-network/vizScript')

it('renders without crashing', async () => {
  const { Component } = await import('./SyriaNetwork')
  render(
    <Router>
      <Component />
    </Router>
  )
})
