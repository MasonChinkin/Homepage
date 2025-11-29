import { heightTransitionWrapper } from 'src/styles/utilityStyles'
import ProjectGridItem from './ProjectGridItem'
import { d3Projects } from './projectList'
import { projectsWrapper, projects } from './projectsStyles'

const D3ProjectGrid = () => {
  const cards = d3Projects.map((project) => (
    <ProjectGridItem project={project} key={project.title} />
  ))

  const styles = [projects.base, cards.length < 5 && projects.marginsOnly]

  return (
    <div css={heightTransitionWrapper}>
      <main css={projectsWrapper}>
        <div css={styles}>{cards}</div>
      </main>
    </div>
  )
}

export default D3ProjectGrid
