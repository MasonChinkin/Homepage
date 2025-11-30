import { useState } from 'react'
import {
  introContainer,
  avatarImg as avatarImgStyle,
  introText,
} from 'src/components/home/homeStyles'
import avatarImg from 'src/static/images/avatar.jpg'
import { frostedStyle, loadingImg } from 'src/styles/utilityStyles'

const Intro = () => {
  const [imgLoaded, setImgLoaded] = useState<boolean>(false)

  return (
    <section css={[introContainer, frostedStyle]}>
      <div css={introText}>
        <h1>Mason Chinkin</h1>
        <p>
          Economist turned software engineer.{' '}
          <a target="_blank" rel="noopener noreferrer" href="https://d3js.org/">
            D3js
          </a>{' '}
          enthusiast.
          <br />
          <br />
          My favorite quote about data viz: &quot;The line must be drawn here!
          This far, no further!&quot; -
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://youtu.be/s3RNsZvdYZQ?t=102"
          >
            {' '}
            Jean-Luc Picard
          </a>
        </p>
      </div>
      <img
        css={[avatarImgStyle, !imgLoaded && loadingImg]}
        onLoad={(): void => setImgLoaded(true)}
        alt="avatar of Mason Chinkin"
        src={avatarImg}
        decoding="async"
      />
    </section>
  )
}

export default Intro
