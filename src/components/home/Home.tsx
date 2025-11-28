import FeaturedProjects from './featured/FeaturedProjects'
import { homeContainer } from './homeStyles'
import Intro from './intro/Intro'
import { heightTransitionWrapper } from 'src/styles/utilityStyles'

const Home = () => (
  <div css={heightTransitionWrapper}>
    <main css={homeContainer}>
      <Intro />
      <FeaturedProjects />
    </main>
  </div>
)

export default Home
