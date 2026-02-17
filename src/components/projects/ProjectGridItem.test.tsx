import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { d3Projects } from 'src/components/projects/projectList'
import ProjectGridItem from './ProjectGridItem'

const project = d3Projects[0]

it('renders project title and description', () => {
  render(
    <MemoryRouter>
      <ProjectGridItem project={project} />
    </MemoryRouter>
  )
  expect(screen.getByText(project.title)).toBeInTheDocument()
  expect(screen.getByText(project.description)).toBeInTheDocument()
})

it('card is clickable', () => {
  render(
    <MemoryRouter>
      <ProjectGridItem project={project} />
    </MemoryRouter>
  )
  expect(screen.getByRole('button')).toBeInTheDocument()
})
