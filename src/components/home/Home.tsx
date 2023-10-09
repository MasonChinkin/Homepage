import FeaturedProjects from './featured/FeaturedProjects'
import Intro from './intro/Intro'

const Home = () => (
  <div className="height-transition-wrapper">
    <main className="home">
      <Intro />
      <FeaturedProjects />
    </main>
  </div>
)

export default Home
