import { css } from '@emotion/react'
import { useState } from 'react'
import Card from 'src/components/ui/Card'
import { loadingImg } from 'src/styles/utilityStyles'
import { useLocation } from 'wouter'
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
  const [, setLocation] = useLocation()

  const handleClick = () => {
    if (internalLink) {
      setLocation(internalLink)
    } else if (externalLink) {
      window.open(externalLink, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <Card css={[projectCard, clickableCard]} onClick={handleClick}>
      <Card.Img
        css={[projectCardImg, !imgLoaded && loadingImg]}
        src={img}
        alt={title}
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
