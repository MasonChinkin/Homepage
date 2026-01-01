import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import D3Layout, { useD3Theme } from 'src/components/d3/layout/D3Layout'

const BarChart = () => {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useD3Theme()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        })
      }
    }

    handleResize() // Initial size

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || dimensions.height === 0)
      return

    const width = dimensions.width
    const height = dimensions.height

    // Clear previous
    d3.select(svgRef.current).selectAll('*').remove()

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    const data = [
      { name: 'A', value: 30 },
      { name: 'B', value: 80 },
      { name: 'C', value: 45 },
      { name: 'D', value: 60 },
      { name: 'E', value: 20 },
      { name: 'F', value: 90 },
      { name: 'G', value: 55 },
    ]

    const margin = { top: 20, right: 20, bottom: 40, left: 40 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, innerWidth])
      .padding(0.2)

    const y = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0])

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.name)!)
      .attr('y', (d) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d) => innerHeight - y(d.value))
      .attr('fill', theme.accent)
      .attr('rx', 4)

    // X Axis
    const xAxis = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))

    xAxis.selectAll('text').attr('color', theme.text).style('font-size', '14px')

    xAxis.selectAll('path, line').attr('stroke', theme.text)

    // Y Axis
    const yAxis = g.append('g').call(d3.axisLeft(y))

    yAxis.selectAll('text').attr('color', theme.text).style('font-size', '14px')

    yAxis.selectAll('path, line').attr('stroke', theme.text)
  }, [theme, dimensions])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef} />
    </div>
  )
}

export const Component = () => {
  return (
    <D3Layout title="D3 Template Project" vizConfig={{ showBorder: true }}>
      <BarChart />
    </D3Layout>
  )
}
