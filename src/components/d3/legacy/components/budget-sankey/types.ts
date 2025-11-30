export interface BudgetDataRow {
  year: string | number
  source: string
  target: string
  value: string | number
  dollars: number
  type: string
}

export interface DeficitDataRow {
  year: string | number
  deficit: number
  spending: number
}

export interface BarDataRow {
  year: number
  Balance: number
  Revenue: number
  Spending: number
  [key: string]: number
}

export interface SankeyNode {
  node: number
  name: string
  x?: number
  dx?: number
  y?: number
  dy?: number
  value?: number
  sourceLinks?: SankeyLink[]
  targetLinks?: SankeyLink[]
}

export interface SankeyLink {
  source: SankeyNode | number
  target: SankeyNode | number
  value: number
  type?: string
  dy?: number
  sy?: number
  ty?: number
  id?: string
}

export interface VizState {
  thisYear: number
  nodes: SankeyNode[]
  links: SankeyLink[]
  lineData: BudgetDataRow[]
  thisYearDeficit: DeficitDataRow[]
}
