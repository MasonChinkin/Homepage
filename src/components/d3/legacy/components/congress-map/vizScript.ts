import * as d3 from 'd3'

interface CandidateData {
  candidate: string
  party: string
  percentage: number
}

interface FeatureProperties {
  STATEFP: string
  CD115FP: string
  district?: string
  winningParty?: string
  winningMargin?: number
  name?: string
  candidates: CandidateData[]
}

interface CongressFeature {
  type: 'Feature'
  properties: FeatureProperties
  geometry: d3.GeoGeometryObjects
}

interface CongressGeoJSON {
  type: 'FeatureCollection'
  features: CongressFeature[]
}

interface CsvData {
  state_fips: string
  district: string
  state: string
  candidate: string
  party: string
  general_perc: string
  winner: string
}

export default function initializeViz() {
  const container = document.getElementById('container')
  if (!container) return

  // Width and height
  const w = container.offsetWidth
  const h = container.offsetHeight

  // define projection
  const projection = d3
    .geoAlbers()
    .scale(1000)
    .translate([w / 2, h / 2])

  // define zoom behavior
  const zoom = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.5, 10])
    .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
      map.style('stroke-width', `${1 / event.transform.k}px`)
      map.attr('transform', event.transform.toString())
    })

  // define path
  const path = d3.geoPath().projection(projection)

  // create SVG
  const svg = d3
    .select('#container')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

  // create container for all pannable/zoomable elements
  const map = svg.append('g')
  svg.call(zoom)

  // invisible rect for dragging on whitespace
  map
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', w)
    .attr('height', h)
    .attr('opacity', 0)

  let tooltipDiv: d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown>

  d3.csv('/data/congress-map/congress_results_2016.csv').then((rawData) => {
    const data = rawData as unknown as CsvData[]
    d3.json<CongressGeoJSON>(
      '/data/congress-map/us_congress_2016_lower_48.json'
    ).then((json) => {
      if (!data || !json) return

      // loop through, merging data with map
      for (let i = 0; i < data.length; i++) {
        const dataDistrict = `${data[i].state_fips}-${data[i].district}`

        for (let j = 0; j < json.features.length; j++) {
          const jsonDistrict = `${json.features[j].properties.STATEFP}-${json.features[j].properties.CD115FP}`

          if (!json.features[j].properties.candidates) {
            json.features[j].properties.candidates = []
          }

          if (dataDistrict === jsonDistrict && data[i].winner) {
            json.features[j].properties.district = jsonDistrict
            json.features[j].properties.winningParty = data[i].party
            json.features[j].properties.winningMargin = parseFloat(
              data[i].general_perc
            )
            json.features[j].properties.name =
              `${data[i].state} District ${data[i].district}`
          }

          if (
            dataDistrict === jsonDistrict &&
            data[i].candidate !== 'Total Votes'
          ) {
            json.features[j].properties.candidates.push({
              candidate: data[i].candidate,
              party: data[i].party,
              percentage: parseFloat(data[i].general_perc),
            })
          }
        }
      }

      // bind data and create one path per json feature (district)
      map
        .selectAll('path')
        .data(json.features)
        .enter()
        .append('path')
        .attr('d', path)
        .style('fill', stateFill)
        .style('opacity', (d) => d.properties.winningMargin || 0)
        .style('stroke', 'white')
        .attr('class', (d) => d.properties.district || '')
        .attr('name', (d) => d.properties.name || '')
        .on('mouseover', function (event: MouseEvent, d: CongressFeature) {
          d3.select(this).style('fill', 'orange')

          // Define the div for the tooltip
          tooltipDiv = d3
            .select('body')
            .append('div')
            .attr('class', 'tooltip')
            .style('left', `${event.pageX + 20}px`)
            .style('top', `${event.pageY}px`)

          tooltipDiv.style('opacity', '0.9')

          let resultsString = ''

          // construct each line of the tooltip
          d.properties.candidates.forEach((el) => {
            resultsString = `${resultsString}<p>(${el.party})  ${el.candidate}: ${d3.format('.1%')(el.percentage)}</p>`
          })

          if (d.properties.name == null) {
            tooltipDiv.html('N/A')
          } else {
            tooltipDiv.html(
              `<strong>${d.properties.name}</strong>${resultsString}`
            )
          }
        })
        .on('mousemove', (event: MouseEvent) =>
          tooltipDiv
            .style('left', `${event.pageX + 20}px`)
            .style('top', `${event.pageY}px`)
        )
        .on('mouseout', function (event: MouseEvent, d: CongressFeature) {
          d3.select(this).style('fill', stateFill(d))

          d3.selectAll('.tooltip').exit().remove()

          tooltipDiv.style('opacity', '0.0')
        })
    })
  })

  const wLegend = w * 0.04
  const hLegend = h * 0.6

  map
    .append('rect')
    .attr('x', wLegend)
    .attr('y', hLegend + 27)
    .attr('width', 15)
    .attr('height', 15)
    .style('fill', 'blue')

  map
    .append('rect')
    .attr('x', wLegend)
    .attr('y', hLegend + 27 + 30)
    .attr('width', 15)
    .attr('height', 15)
    .style('fill', 'red')

  map
    .append('rect')
    .attr('x', wLegend)
    .attr('y', hLegend + 27 + 60)
    .attr('width', 15)
    .attr('height', 15)
    .style('fill', 'grey')

  map
    .append('text')
    .attr('x', wLegend + 20)
    .attr('y', hLegend + 40)
    .text('Democrat')
    .attr('class', 'legend')

  map
    .append('text')
    .attr('x', wLegend + 20)
    .attr('y', hLegend + 70)
    .text('Republican')
    .attr('class', 'legend')

  map
    .append('text')
    .attr('x', wLegend + 20)
    .attr('y', hLegend + 100)
    .text('Data Pending')
    .attr('class', 'legend')

  // Source
  map
    .append('text')
    .attr('x', w * 0.85)
    .attr('y', h * 0.95)
    .attr('dy', '0em')
    .text('Source: FEC')
    .attr('class', 'legend')
    .attr('font-size', 14)

  // define fill for all combo party names
  function stateFill(d: CongressFeature) {
    const reds = ['R', 'R/IP', 'R/TRP']
    const blues = ['D', 'DFL', 'D/IP', 'D/R', 'D/PRO/WF/IP']
    if (reds.includes(d.properties.winningParty || '')) {
      return 'rgb(235,25,28)'
    }
    if (blues.includes(d.properties.winningParty || '')) {
      return 'rgb(28,25,235)'
    }
    return 'grey'
  }
}
