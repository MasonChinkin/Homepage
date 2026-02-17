import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Component as Profile } from './Profile'

it('renders the home route by default', () => {
  render(
    <MemoryRouter>
      <Profile />
    </MemoryRouter>
  )
  expect(
    screen.getByRole('heading', { name: /mason chinkin/i })
  ).toBeInTheDocument()
})
