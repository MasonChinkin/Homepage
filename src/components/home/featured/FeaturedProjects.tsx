import { d3Projects } from 'src/components/projects/projectList'
import FeaturedProjectItem from './FeaturedProjectItem'

const Featured = () => {
  const featuredProjects = [
    d3Projects[0], // redditVisualization
    d3Projects[1], // federalBudgetSankey
    d3Projects[2], // syria network
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
