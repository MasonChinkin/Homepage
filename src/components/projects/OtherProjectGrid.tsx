import classNames from 'classnames'
import ProjectGridItem from './ProjectGridItem'
import { otherProjects } from './projectList'

const OtherProjectGrid = () => {
  const cards: JSX.Element[] = otherProjects.map(
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

export default OtherProjectGrid
