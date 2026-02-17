import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from './Button'

it('renders children', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
})

it('calls onClick handler', async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>Click</Button>)
  await user.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalledOnce()
})

it('renders primary variant by default', () => {
  render(<Button>Primary</Button>)
  expect(screen.getByRole('button')).toBeInTheDocument()
})
