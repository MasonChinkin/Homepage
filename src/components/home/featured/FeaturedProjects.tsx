import FeaturedProjectItem from './FeaturedProjectItem'
import { d3Projects, otherProjects } from '../../projects/projectList'

const Featured = () => {
  const featuredProjects = [
    d3Projects[0], // redditVisualization
    d3Projects[1], // federalBudgetSankey
    otherProjects[0], // availableFlatSurface
  ]

  const featuredProjectsTiles: JSX.Element[] = featuredProjects.map(
    (project, i: number): JSX.Element => (
      <FeaturedProjectItem project={project} key={project.title} />
    )
  )

  return (
    <section className="featured">
      <h2>Featured Projects</h2>
      <div className="featured-projects">{featuredProjectsTiles}</div>
    </section>
  )
}

export default Featured
