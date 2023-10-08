import { useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import classNames from 'classnames'
import { ProjectType } from './projectList'

type ProjectGridItemProps = {
  project: ProjectType
}

const ProjectGridItem = ({ project }: ProjectGridItemProps) => {
  const { img, title, description, liveLink, githubLink } = project
  const [imgLoaded, setImgLoaded] = useState<boolean>(false)

  const imgClasses = classNames('card-img', {
    'loading-img': !imgLoaded,
  })

  return (
    <Card>
      <Card.Img
        className={imgClasses}
        variant="top"
        src={img}
        onLoad={(): void => setImgLoaded(true)}
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Text>{description}</Card.Text>
        <div className="card-links">
          <a href={liveLink}>
            <Button variant="primary">Live</Button>
          </a>
          {githubLink && (
            <a href={githubLink}>
              <Button variant="secondary">Repo</Button>
            </a>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}

export default ProjectGridItem
