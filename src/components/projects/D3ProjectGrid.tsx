import ProjectGridItem from './ProjectGridItem'
import { d3Projects } from './projectList'
import { projectsWrapper, projects } from './projectsStyles'
import { heightTransitionWrapper } from 'src/styles/utilityStyles'

const D3ProjectGrid = () => {
  const cards: JSX.Element[] = d3Projects.map(
    (project, i: number): JSX.Element => (
      <ProjectGridItem project={project} key={project.title} />
    )
  )

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
