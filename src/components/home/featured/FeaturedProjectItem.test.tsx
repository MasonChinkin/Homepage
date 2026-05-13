import { render, screen } from '@testing-library/react'
import { d3Projects } from 'src/components/projects/projectList'
import { Router } from 'wouter'
import FeaturedProjectItem from './FeaturedProjectItem'

const project = d3Projects[0]

it('renders project title and description', () => {
  render(
    <Router>
      <FeaturedProjectItem project={project} />
    </Router>
  )
  expect(screen.getByText(project.title)).toBeInTheDocument()
  expect(screen.getByText(project.description)).toBeInTheDocument()
})
