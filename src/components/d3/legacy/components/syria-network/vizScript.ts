import { type D3DragEvent, drag } from 'd3-drag'
import { json } from 'd3-fetch'
import {
  type ForceLink,
  forceCenter,
  forceLink,
  forceManyBody,
  forceSimulation,
} from 'd3-force'
import { select, selectAll } from 'd3-selection'
import 'd3-transition'

interface NodeData {
  id: string
  image: string
  targets: string
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

interface LinkData {
  source: string | NodeData
  target: string | NodeData
  type: string
}

interface GraphData {
  nodes: NodeData[]
  links: LinkData[]
}

export default function initializeViz() {
  const container = document.getElementById('container')
  if (!container) return

  // Width and height
  const w = container.offsetWidth
  const h = container.offsetHeight
  const imageSize = 30

  const greyedOpacity = 0.1

  const svg = select('#container')
    .append('svg')
    .attr('height', h)
    .attr('width', w)

  const simulation = forceSimulation<NodeData>()
    .force(
      'link',
      forceLink<NodeData, LinkData>().id((d) => d.id)
    )
    .force('charge', forceManyBody<NodeData>().strength(-1600))
    .force('center', forceCenter(w / 2, h * 0.44))

  json<GraphData>('/data/syria-network/syriaNetwork.json').then((data) => {
    if (!data) return

    const path = svg
      .append('g')
      .selectAll('path')
      .data(data.links)
      .enter()
      .append('path')
      .attr('class', (d) => `link ${d.type}`)
      .attr('thisConnects', (d) => `${d.source} ${d.target}`)

    path
      .filter((d) => d.type !== 'Enemy')
      .attr('marker-end', 'url(#arrowheadEnd)')
      .attr('marker-mid', 'url(#arrowheadEnd)')

    const node = svg
      .selectAll('.node')
      .data(data.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .on('mouseover', nodeMouseOver)
      .on('mouseout', nodeMouseOut)
      .call(
        drag<SVGGElement, NodeData>()
          .on('start', dragStarted)
          .on('drag', dragged)
          .on('end', dragEnded)
      )

    node
      .append('image')
      .attr('href', (d) => d.image.replace('data/', '/data/syria-network/'))
      .attr('x', -imageSize / 2)
      .attr('y', -imageSize / 2)
      .attr('width', imageSize)
      .attr('height', imageSize)

    // Add arrow marker definition to defs
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrowheadEnd')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', -0.5)
      .attr('orient', 'auto')
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('overflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', 'darkGrey')
      .style('stroke', 'none')

    node
      .append('text')
      .attr('class', 'nodeLabel')
      .attr('dy', imageSize)
      .text((d) => d.id)

    simulation.nodes(data.nodes).on('tick', function () {
      path.attr('d', linkArc)

      node.attr('transform', (d) => `translate(${d.x},${d.y})`)
    })

    simulation.force<ForceLink<NodeData, LinkData>>('link')!.links(data.links)
  })

  // Legend
  const wLegend = w * 0.02
  const hLegend = h * 0.03

  svg
    .append('rect')
    .attr('x', wLegend)
    .attr('y', hLegend)
    .attr('width', 20)
    .attr('height', 20)
    .style('fill', 'blue')

  svg
    .append('text')
    .attr('x', wLegend + 30)
    .attr('y', hLegend + 15)
    .text('Providing financial and/or material support')
    .attr('class', 'labelText')

  svg
    .append('rect')
    .attr('x', wLegend)
    .attr('y', hLegend + 25)
    .attr('width', 20)
    .attr('height', 20)
    .style('fill', 'red')

  svg
    .append('text')
    .attr('x', wLegend + 30)
    .attr('y', hLegend + 40)
    .text('Direct conflict')
    .attr('class', 'labelText')

  function dragStarted(
    event: D3DragEvent<SVGGElement, NodeData, NodeData>,
    d: NodeData
  ) {
    if (!event.active) simulation.alphaTarget(0.3).restart()
    d.fx = event.x
    d.fy = event.y
  }

  function dragged(
    event: D3DragEvent<SVGGElement, NodeData, NodeData>,
    d: NodeData
  ) {
    d.fx = Math.max(imageSize / 2, Math.min(w - imageSize / 2, event.x))
    d.fy = Math.max(imageSize / 2, Math.min(h - imageSize - 10, event.y))
  }

  function dragEnded(
    event: D3DragEvent<SVGGElement, NodeData, NodeData>,
    d: NodeData
  ) {
    if (!event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  function linkArc(d: LinkData) {
    const source = d.source as NodeData
    const target = d.target as NodeData
    const dx = target.x! - source.x!
    const dy = target.y! - source.y!
    const dr = Math.sqrt(dx * dx + dy * dy)
    return `M${source.x},${source.y}A${dr},${dr} 0 0,1 ${target.x},${target.y}`
  }

  const nodeMouseOver = function (event: MouseEvent, d: NodeData) {
    const thisConnections = d.targets
    const thisType = d.id

    selectAll<SVGGElement, NodeData>('.node').each(function (nodeData) {
      const thisNodeType = nodeData.id
      const isConnected = thisConnections.includes(thisNodeType)
      const node = select(this)

      if (!isConnected) {
        node.transition().duration(200).style('opacity', greyedOpacity)
      }
    })

    selectAll<SVGPathElement, LinkData>('.link').each(function () {
      const thisConnects = select(this).attr('thisConnects')
      const isConnected = thisConnects.includes(thisType)
      const path = select(this)

      if (!isConnected) {
        path.transition().duration(200).style('opacity', greyedOpacity)
      }
    })
  }

  const nodeMouseOut = function () {
    selectAll('.node').transition().duration(200).style('opacity', 1)
    selectAll('.link').transition().duration(200).style('opacity', 1)
  }
}
