import AboutImg from './AboutImg'
import { aboutContainer } from './aboutStyles'

const About = () => (
  <div className="height-transition-wrapper">
    <main css={aboutContainer} className="frosted">
      <section className="about-me">
        <h2>About Me</h2>
        <AboutImg />
        <p>I like food.</p>
        <br />
        <p>But also...</p>
        <br />
        <p>
          After several years as an economist writing about complex problems, I
          decided I would rather make the tools that help people tell their
          story or simply make sense of it. I also love making shiny, beautiful,
          and useful data visualizations with d3.js.
        </p>
      </section>
    </main>
  </div>
)

export default About
