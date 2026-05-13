import { ChartBar } from 'src/components/ui/icons'
import bubbleChart from 'src/static/images/bubble-chart.svg'
import Tooltip from './Tooltip'

const Visualization = () => {
  return (
    <section className="visualization-container">
      <div className="visualization-options">
        <button id="bar-button" type="button">
          <ChartBar
            aria-label="Bar chart"
            className="bar-chart-icon"
            style={{ fontSize: 28 }}
          />
        </button>
        <button id="bubble-button" type="button">
          <img
            className="bubble-button-icon"
            src={bubbleChart}
            alt="bubble chart icon"
          />
        </button>
        <button id="scatter-button" type="button">
          <img
            src="https://img.icons8.com/metro/26/000000/scatter-plot.png"
            alt="scatter plot icon"
          />
        </button>
      </div>
      <div id="visualization" />
      <Tooltip />
    </section>
  )
}

export default Visualization
