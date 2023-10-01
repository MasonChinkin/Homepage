import { useState } from 'react'
import classNames from 'classnames'

const AboutImg = () => {
  const [imgLoaded, setImgLoaded] = useState<boolean>(false)
  const isPhone: boolean = window.innerWidth <= 450

  const imgClasses = classNames('about-img', {
    'loading-img': !imgLoaded,
  })

  return (
    <img
      className={imgClasses}
      onLoad={() => setImgLoaded(true)}
      src={isPhone ? 'images/about_me_mobile.png' : 'images/about_me.png'}
      alt="Me liking food"
    />
  )
}

export default AboutImg
