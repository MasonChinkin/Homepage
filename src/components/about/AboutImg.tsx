import { useState } from 'react'
import aboutMeImg from 'src/static/images/about_me.png'
import aboutMeMobileImg from 'src/static/images/about_me_mobile.png'
import { isPhone } from 'src/utils/device'
import { loadingImg } from 'src/styles/utilityStyles'
import { aboutImg, aboutImgLoading } from './aboutStyles'

const AboutImg = () => {
  const [imgLoaded, setImgLoaded] = useState<boolean>(false)

  return (
    <img
      css={[aboutImg, !imgLoaded && [loadingImg, aboutImgLoading]]}
      onLoad={() => setImgLoaded(true)}
      src={isPhone ? aboutMeMobileImg : aboutMeImg}
      alt="Me liking food"
    />
  )
}

export default AboutImg
