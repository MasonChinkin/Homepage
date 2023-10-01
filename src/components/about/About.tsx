import AboutImg from './AboutImg'

const About = () => (
  <div className="height-transition-wrapper">
    <main className="about frosted">
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
      <section>
        <h3 className="about-this-website">About This Website</h3>
        <p>
          This website is a multi-container application using Docker and Docker
          Compose, with Nginx directing traffic based on subdirectory,
          essentially allowing me to treat projects like microservices. This is
          all hosted and continuously deployed with Google Cloud Platform&apos;s
          Compute Engine and Cloud Build, respectively. The web app itself is
          using TypeScript and React.
          <br />
        </p>
        <br />
        <p>
          Aside from the desire to learn these tools, this setup implements two
          great features:
        </p>
        <ul>
          <li>
            Commits pushed to github are automatically tested and (if tests
            pass) deployed to the Compute Engine instance.
          </li>
          <li>
            Independent apps in independent repos are served under
            subdirectories. This allows the freedom to explore different
            projects with no concern for dependencies or git histories.{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://masonchinkin.com/"
            >
              masonchinkin.com
            </a>{' '}
            was built with create-react-app while{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://masonchinkin.com/d3-projects/reddit-visualization"
            >
              masonchinkin.com/d3-projects/reddit-visualization
            </a>{' '}
            is a NextJS app made to render my d3 projects using all of that
            framework&apos;s under the hood magic.
          </li>
        </ul>
      </section>
    </main>
  </div>
)

export default About
