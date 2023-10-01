import classNames from 'classnames'
import ProjectGridItem from './ProjectGridItem'
import { d3Projects } from './projectList'

const D3ProjectGrid = () => {
  const cards: JSX.Element[] = d3Projects.map(
    (project, i: number): JSX.Element => (
      <ProjectGridItem project={project} key={project.title} />
    )
  )

  const classes = classNames('projects', {
    'margins-only': cards.length < 5,
  })

  return (
    <div className="height-transition-wrapper">
      <main className="projects-wrapper">
        <div className={classes}>{cards}</div>
      </main>
    </div>
  )
}

export default D3ProjectGrid
