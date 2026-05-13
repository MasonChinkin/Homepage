import { ChartBar, ScatterPlot } from 'src/components/ui/icons'
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
          <ScatterPlot aria-label="Scatter plot" style={{ fontSize: 26 }} />
        </button>
      </div>
      <div id="visualization" />
      <Tooltip />
    </section>
  )
}

export default Visualization
