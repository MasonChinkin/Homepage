import { useState } from 'react'
import classNames from 'classnames'
import aboutMeImg from '../../static/images/about_me.png'
import aboutMeMobileImg from '../../static/images/about_me_mobile.png'
import { isPhone } from '../../utils/device'

const AboutImg = () => {
  const [imgLoaded, setImgLoaded] = useState<boolean>(false)

  const imgClasses = classNames('about-img', {
    'loading-img': !imgLoaded,
  })

  return (
    <img
      className={imgClasses}
      onLoad={() => setImgLoaded(true)}
      src={isPhone ? aboutMeMobileImg : aboutMeImg}
      alt="Me liking food"
    />
  )
}

export default AboutImg
