import {
  featuredContainer,
  featuredProjects,
} from 'src/components/home/featuredStyles'
import { d3Projects } from 'src/components/projects/projectList'
import FeaturedProjectItem from './FeaturedProjectItem'

const Featured = () => {
  const projects = [
    d3Projects[0], // redditVisualization
    d3Projects[1], // federalBudgetSankey
    d3Projects[2], // syria network
  ]

  const featuredProjectsTiles = projects.map((project) => (
    <FeaturedProjectItem project={project} key={project.title} />
  ))

  return (
    <section css={featuredContainer}>
      <h2>Featured Projects</h2>
      <div css={featuredProjects}>{featuredProjectsTiles}</div>
    </section>
  )
}

export default Featured
