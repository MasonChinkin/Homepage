import { useState } from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { ProjectType } from 'src/components/projects/projectList'
import { isPhone } from 'src/utils/device'

type FeaturedProjectItemProps = {
  project: ProjectType
}

const FeaturedProjectItem = ({ project }: FeaturedProjectItemProps) => {
  const { img, webp, title, description, externalLink, internalLink } = project
  const [imgLoaded, setImgLoaded] = useState<boolean>(false)

  const imgClasses = classNames('featured-project-item-img', {
    'loading-img': !imgLoaded,
    'featured-project-item-img-hover': !!webp,
  })

  const content = (
    <>
      <img
        className={imgClasses}
        onLoad={(): void => setImgLoaded(true)}
        src={img}
        alt="static project screenshot"
      />
      {!isPhone && (
        <img
          className="featured-project-item-webp"
          src={webp}
          alt="project webp"
        />
      )}
      <div className="featured-project-caption">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </>
  )

  if (internalLink) {
    return (
      <figure className="featured-project-item-wrapper">
        <Link to={internalLink} className="featured-project-item">
          {content}
        </Link>
      </figure>
    )
  }

  return (
    <figure className="featured-project-item-wrapper">
      <a
        rel="noopener noreferrer"
        href={externalLink}
        className="featured-project-item"
      >
        {content}
      </a>
    </figure>
  )
}

export default FeaturedProjectItem
