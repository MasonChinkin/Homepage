import { max, min } from 'd3-array'
import { format as d3Format } from 'd3-format'
import { type ScaleBand, type ScaleLinear, scaleLinear } from 'd3-scale'
import { select, selectAll } from 'd3-selection'
import 'd3-transition'
import type {
  BudgetDataRow,
  DeficitDataRow,
  SankeyNode,
  SankeyLink,
} from './types'

// format variables
export const formatNumber = d3Format('.1f')
export const format = (d: number) => formatNumber(d)

export const fontScale = scaleLinear<number>().range([14, 22])

// transition times
export const newYearTransition = 800
export const highlightTransition = 50

export const onlyUnique = (value: any, index: number, self: any[]) =>
  self.indexOf(value) === index

export const stackMin = (series: Iterable<[number, number]>) =>
  min(series, (d) => d[0])!

export const stackMax = (series: Iterable<[number, number]>) =>
  max(series, (d) => d[1])!

export interface ProcessedData {
  nodes: SankeyNode[]
  links: SankeyLink[]
  lineData: BudgetDataRow[]
  thisYearDeficit: DeficitDataRow[]
}

export const newData = (
  csv: BudgetDataRow[],
  deficit: DeficitDataRow[],
  thisYear: number
): ProcessedData => {
  const thisYearCsv = csv.filter((d) => +d.year === thisYear)
  thisYearCsv.forEach((d) => {
    d.dollars = +d.dollars
  })
  const thisYearDeficit = deficit.filter((d) => +d.year === thisYear)

  // create an array to push all sources and targets, before making them unique
  // because starting nodes are not targets and end nodes are not sources
  const arr: string[] = []
  thisYearCsv.forEach((d) => {
    arr.push(d.source)
    arr.push(d.target)
  })

  // create nodes array
  const nodes: SankeyNode[] = arr.filter(onlyUnique).map((name, i) => {
    return {
      node: i,
      name,
    }
  })

  // create links array
  const links: SankeyLink[] = thisYearCsv.map((row) => {
    const getNode = (type: 'source' | 'target') => {
      return nodes.filter((node_object) => node_object.name === row[type])[0]
        .node
    }

    return {
      source: getNode('source'),
      target: getNode('target'),
      value: +row.value,
      type: row.type,
    }
  })

  const lineData: BudgetDataRow[] = csv.map((d) => ({
    ...d,
    year: +d.year,
    value: +d.value,
  }))

  return {
    lineData,
    links,
    nodes,
    thisYearDeficit,
  }
}

// Interfaces for highlight function parameters
export interface HighlightParams {
  key: string
  lineData: BudgetDataRow[]
  thisYear: number
  revLineX: ScaleBand<number>
  spendLineX: ScaleBand<number>
  lineY: ScaleLinear<number, number>
}

export const highlight = (
  element: SVGElement,
  params: HighlightParams
): void => {
  const { lineData, thisYear, revLineX, spendLineX, lineY } = params
  const key = select(element).attr('key')

  const lineLabelData = lineData.filter(
    (d) =>
      d.source.split(' ').join('_') === key ||
      d.target.split(' ').join('_') === key
  )

  selectAll('.line')
    .filter(function () {
      return select(this).attr('key') === key
    })
    .transition()
    .duration(highlightTransition)
    .style('opacity', 1)

  selectAll('.line')
    .filter(function () {
      return select(this).attr('key') !== key
    })
    .transition()
    .duration(highlightTransition)
    .style('opacity', 0.2)

  selectAll('.link')
    .filter(function () {
      return select(this).attr('key') === key
    })
    .transition()
    .duration(highlightTransition)
    .style('stroke-opacity', 0.7)

  selectAll('.link')
    .filter(function () {
      return select(this).attr('key') !== key
    })
    .transition()
    .duration(highlightTransition)
    .style('stroke-opacity', 0.4)

  selectAll('.nodeRect')
    .filter(function () {
      return select(this).attr('key') === key
    })
    .transition()
    .duration(highlightTransition)
    .style('opacity', 1)

  selectAll('.nodeRect')
    .filter(function () {
      return select(this).attr('key') !== key
    })
    .transition()
    .duration(highlightTransition)
    .style('opacity', 0.5)

  // data points
  selectAll('.lineLabel').remove()

  selectAll('.lineNode')
    .filter(function () {
      return select(this).attr('key') === key
    })
    .append('g')
    .selectAll('text')
    .data(lineLabelData)
    .enter()
    .append('text')
    .filter(
      (d, i) =>
        i === 0 || i === lineLabelData.length - 1 || +d.year === thisYear
    )
    .attr('x', (d) =>
      d.type === 'Revenue' ? revLineX(+d.year)! : spendLineX(+d.year)!
    )
    .attr('y', (d) => lineY(+d.value) - 14)
    .text((d) => formatNumber(+d.value))
    .attr('class', 'lineLabel')
}
