import { css } from '@emotion/react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from 'src/components/ui/Card'
import { loadingImg } from 'src/styles/utilityStyles'
import { ProjectType } from './projectList'
import {
  projectCard,
  projectCardBody,
  projectCardImg,
  projectCardText,
  projectCardTitle,
} from './projectsStyles'

type ProjectGridItemProps = {
  project: ProjectType
}

const clickableCard = css({
  cursor: 'pointer',
})

const ProjectGridItem = ({ project }: ProjectGridItemProps) => {
  const { img, title, description, internalLink, externalLink } = project
  const [imgLoaded, setImgLoaded] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleClick = () => {
    if (internalLink) {
      navigate(internalLink)
    } else if (externalLink) {
      window.open(externalLink, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Card css={[projectCard, clickableCard]} onClick={handleClick}>
      <Card.Img
        css={[projectCardImg, !imgLoaded && loadingImg]}
        src={img}
        onLoad={(): void => setImgLoaded(true)}
        loading="lazy"
        decoding="async"
      />
      <Card.Body css={projectCardBody}>
        <Card.Title css={projectCardTitle}>{title}</Card.Title>
        <Card.Text css={projectCardText}>{description}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default ProjectGridItem
