import { render, screen } from '@testing-library/react'
import { Router } from 'wouter'
import { Component as Profile } from './Profile'

it('renders the home route by default', () => {
  render(
    <Router>
      <Profile />
    </Router>
  )
  expect(
    screen.getByRole('heading', { name: /mason chinkin/i })
  ).toBeInTheDocument()
})
