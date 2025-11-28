import { useState } from 'react'
import { Card, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { ProjectType } from './projectList'
import { loadingImg } from 'src/styles/utilityStyles'
import {
  projectCard,
  projectCardBody,
  projectCardImg,
  projectCardLinks,
  projectCardText,
  projectCardTitle,
} from './projectsStyles'

type ProjectGridItemProps = {
  project: ProjectType
}

const ProjectGridItem = ({ project }: ProjectGridItemProps) => {
  const { img, title, description, internalLink, externalLink, githubLink } =
    project
  const [imgLoaded, setImgLoaded] = useState<boolean>(false)
  const navigate = useNavigate()

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
    <Card css={projectCard}>
      <Card.Img
        css={[projectCardImg, !imgLoaded && loadingImg]}
        variant="top"
        src={img}
        onLoad={(): void => setImgLoaded(true)}
      />
      <Card.Body css={projectCardBody}>
        <Card.Title css={projectCardTitle}>{title}</Card.Title>
        <Card.Text css={projectCardText}>{description}</Card.Text>
        <div css={projectCardLinks}>
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
