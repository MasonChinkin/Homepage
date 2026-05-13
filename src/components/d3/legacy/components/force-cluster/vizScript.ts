import { range } from 'd3-array'
import { forceCollide, forceSimulation, forceX, forceY } from 'd3-force'
import { scaleOrdinal } from 'd3-scale'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { select } from 'd3-selection'
import { interval as timerInterval } from 'd3-timer'
import 'd3-transition'

interface NodeData {
  id: string
  x: number
  y: number
  r: number
  choice: number
}

export default function initializeViz() {
  const container = document.getElementById('container')
  if (!container) return

  const margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  }
  const w = container.offsetWidth
  const h = container.offsetHeight

  const svg = select('#container')
    .append('svg')
    .attr('width', w + margin.left + margin.right)
    .attr('height', h + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  const node_radius = 5
  const num_nodes = 300

  // colors
  const colors = scaleOrdinal(schemeCategory10)

  // durations
  const colorChange = 500 // delay to see color change before transition
  const changeFoci = 1000 // time to change foci
  const interval = 1750 // timer

  // Foci
  const foci: Record<number, { x: number; y: number }> = {
    0: {
      x: (w / 4) * 1,
      y: (h / 4) * 1,
    },
    1: {
      x: (w / 4) * 3,
      y: (h / 4) * 1,
    },
    2: {
      x: (w / 4) * 3,
      y: (h / 4) * 3,
    },
    3: {
      x: (w / 4) * 1,
      y: (h / 4) * 3,
    },
  }

  // Create node objects
  const nodeData: NodeData[] = range(num_nodes).map((i) => {
    // evenly split between foci, this randomly selects between 0 and 3
    const max = 3
    const min = 0
    const randomChoice = Math.floor(Math.random() * (max - min + 1)) + min

    return {
      id: `node${i}`,
      x: foci[randomChoice].x + Math.random(),
      y: foci[randomChoice].y + Math.random(),
      r: node_radius,
      choice: randomChoice,
    }
  })

  const fx = forceX<NodeData>((d) => foci[d.choice].x)
  const fy = forceY<NodeData>((d) => foci[d.choice].y)

  const collisionForce = forceCollide<NodeData>(node_radius + 1).iterations(10)

  const simulation = forceSimulation<NodeData>(nodeData)
    .velocityDecay(0.4)
    .force('x', fx)
    .force('y', fy)
    .force('collide', collisionForce)
    .nodes(nodeData)
    .on('tick', () => node.attr('transform', (d) => `translate(${d.x},${d.y})`))

  const node = svg
    .append('g')
    .selectAll('circle')
    .data(nodeData)
    .enter()
    .append('circle')
    .attr('r', (d) => d.r)
    .style('fill', (d) => colors(d.choice.toString()))

  timerInterval(timer, interval)

  // Run function periodically to make things move.
  function timer() {
    nodeData.forEach((d) => {
      if (Math.random() < 0.5) {
        // only affect half of nodes
        d.choice = d.choice < 3 ? d.choice + 1 : 0
      }
    })

    node
      .transition()
      .duration(colorChange)
      .style('fill', (d) => colors(d.choice.toString()))

    setTimeout(
      () => simulation.nodes(nodeData).alpha(0.7).restart(),
      changeFoci
    )
  }
}
