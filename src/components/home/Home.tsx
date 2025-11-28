import FeaturedProjects from './featured/FeaturedProjects'
import { homeContainer } from './homeStyles'
import Intro from './intro/Intro'

const Home = () => (
  <div className="height-transition-wrapper">
    <main css={homeContainer}>
      <Intro />
      <FeaturedProjects />
    </main>
  </div>
)

export default Home
