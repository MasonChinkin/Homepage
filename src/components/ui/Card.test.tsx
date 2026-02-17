import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Card from './Card'

it('renders Card with subcomponents', () => {
  render(
    <Card>
      <Card.Body>
        <Card.Title>Test Title</Card.Title>
        <Card.Text>Test description</Card.Text>
      </Card.Body>
    </Card>
  )
  expect(screen.getByText('Test Title')).toBeInTheDocument()
  expect(screen.getByText('Test description')).toBeInTheDocument()
})

it('clickable card fires onClick', async () => {
  const user = userEvent.setup()
  const handleClick = vi.fn()
  render(
    <Card onClick={handleClick}>
      <Card.Body>Content</Card.Body>
    </Card>
  )
  await user.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalledOnce()
})

it('renders Card.Img with alt text', () => {
  render(
    <Card>
      <Card.Img src="img.jpg" alt="A test image" />
    </Card>
  )
  expect(screen.getByRole('img', { name: /a test image/i })).toBeInTheDocument()
})
