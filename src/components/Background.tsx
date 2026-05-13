import { starsSmall, starsMedium, starsBig } from 'src/styles/backgroundStyles'

const Background = () => (
  <div css={{ viewTransitionName: 'site-background' }}>
    <div css={starsSmall} />
    <div css={starsMedium} />
    <div css={starsBig} />
  </div>
)

export default Background
