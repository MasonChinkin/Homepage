import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  featuredProjectItemWrapper,
  featuredProjectItem as featuredProjectItemStyle,
  featuredProjectCaption,
  featuredProjectItemImg,
  featuredProjectItemImgHover,
  featuredProjectItemWebp,
} from 'src/components/home/featuredStyles'
import { ProjectType } from 'src/components/projects/projectList'
import { loadingImg } from 'src/styles/utilityStyles'
import { isPhone } from 'src/utils/device'

type FeaturedProjectItemProps = {
  project: ProjectType
}

const FeaturedProjectItem = ({ project }: FeaturedProjectItemProps) => {
  const { img, webp, title, description, externalLink, internalLink } = project
  const [imgLoaded, setImgLoaded] = useState<boolean>(false)

  const content = (
    <>
      <img
        css={[
          featuredProjectItemImg,
          webp && featuredProjectItemImgHover,
          !imgLoaded && loadingImg,
        ]}
        onLoad={(): void => setImgLoaded(true)}
        src={img}
        alt="static project screenshot"
        loading="lazy"
        decoding="async"
      />
      {!isPhone && (
        <img
          css={featuredProjectItemWebp}
          src={webp}
          alt="project webp"
          loading="lazy"
          decoding="async"
        />
      )}
      <div css={featuredProjectCaption}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </>
  )

  if (internalLink) {
    return (
      <figure css={featuredProjectItemWrapper}>
        <Link to={internalLink} css={featuredProjectItemStyle}>
          {content}
        </Link>
      </figure>
    )
  }

  return (
    <figure css={featuredProjectItemWrapper}>
      <a
        rel="noopener noreferrer"
        href={externalLink}
        css={featuredProjectItemStyle}
      >
        {content}
      </a>
    </figure>
  )
}

export default FeaturedProjectItem
