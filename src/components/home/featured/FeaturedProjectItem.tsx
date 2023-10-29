import { useState } from 'react'
import classNames from 'classnames'
import { ProjectType } from 'src/components/projects/projectList'
import { isPhone } from 'src/utils/device'

type FeaturedProjectItemProps = {
  project: ProjectType
}

const FeaturedProjectItem = ({ project }: FeaturedProjectItemProps) => {
  const { img, webp, title, description, externalLink } = project
  const [imgLoaded, setImgLoaded] = useState<boolean>(false)

  const imgClasses = classNames('featured-project-item-img', {
    'loading-img': !imgLoaded,
    'featured-project-item-img-hover': !!webp,
  })

  return (
    <figure className="featured-project-item-wrapper">
      <a
        rel="noopener noreferrer"
        href={externalLink}
        className="featured-project-item"
      >
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
      </a>
    </figure>
  )
}

export default FeaturedProjectItem
