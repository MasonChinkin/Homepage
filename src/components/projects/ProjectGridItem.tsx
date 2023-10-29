import { useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import classNames from 'classnames'
import { ProjectType } from './projectList'

type ProjectGridItemProps = {
  project: ProjectType
}

const ProjectGridItem = ({ project }: ProjectGridItemProps) => {
  const { img, title, description, internalLink, externalLink, githubLink } =
    project
  const [imgLoaded, setImgLoaded] = useState<boolean>(false)
  const navigate = useNavigate()

  const imgClasses = classNames('card-img', {
    'loading-img': !imgLoaded,
  })

  const handleLink = internalLink ? (
    <Button variant="primary" onClick={() => navigate(internalLink)}>
      Live
    </Button>
  ) : (
    <a rel="noopener noreferrer" href={externalLink}>
      <Button variant="primary">Live</Button>
    </a>
  )

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
          {handleLink}
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
