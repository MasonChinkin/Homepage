import { useState } from 'react'
import classNames from 'classnames'
import { projectType } from '../../projects/projectList'

type FeaturedProjectItemProps = {
  project: projectType
}

const FeaturedProjectItem = ({ project }: FeaturedProjectItemProps) => {
  const { img, gif, title, description, liveLink } = project
  const [imgLoaded, setImgLoaded] = useState<boolean>(false)
  const isPhone: boolean = window.innerWidth <= 450

  const imgClasses = classNames('featured-project-item-img', {
    'loading-img': !imgLoaded,
  })

  return (
    <figure className="featured-project-item-wrapper">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={liveLink}
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
            className="featured-project-item-gif"
            src={gif}
            alt="project gif"
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
