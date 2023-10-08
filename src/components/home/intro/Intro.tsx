import { useState } from 'react'
import classNames from 'classnames'
import avatarImg from '../../../images/avatar.jpg'

const Intro = () => {
  const [imgLoaded, setImgLoaded] = useState<boolean>(false)

  const imgClasses = classNames('avatar-img', {
    'loading-img': !imgLoaded,
  })

  return (
    <section className="intro frosted">
      <div className="intro-text">
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
        className={imgClasses}
        onLoad={(): void => setImgLoaded(true)}
        alt="avatar of Mason Chinkin"
        src={avatarImg}
      />
    </section>
  )
}

export default Intro
