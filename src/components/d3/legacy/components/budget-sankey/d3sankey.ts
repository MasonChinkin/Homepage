import * as d3 from 'd3'

interface SankeyNode {
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

interface SankeyLink {
  source: SankeyNode | number
  target: SankeyNode | number
  value: number
  type?: string
  dy?: number
  sy?: number
  ty?: number
}

interface SankeyLayout {
  nodeWidth: (width?: number) => number | SankeyLayout
  nodePadding: (padding?: number) => number | SankeyLayout
  nodes: (nodes?: SankeyNode[]) => SankeyNode[] | SankeyLayout
  links: (links?: SankeyLink[]) => SankeyLink[] | SankeyLayout
  size: (size?: [number, number]) => [number, number] | SankeyLayout
  layout: (iterations: number) => SankeyLayout
  relayout: () => SankeyLayout
  link: () => {
    (d: SankeyLink): string
    curvature: (curvature?: number) => number | ((d: SankeyLink) => string)
  }
}

export const d3sankey = (): SankeyLayout => {
  let nodeWidth = 24
  let nodePadding = 8
  let size: [number, number] = [1, 1]
  let nodes: SankeyNode[] = []
  let links: SankeyLink[] = []

  const sankey: SankeyLayout = {
    nodeWidth(_?: number) {
      if (!arguments.length) return nodeWidth
      nodeWidth = +_!
      return sankey
    },

    nodePadding(_?: number) {
      if (!arguments.length) return nodePadding
      nodePadding = +_!
      return sankey
    },

    nodes(_?: SankeyNode[]) {
      if (!arguments.length) return nodes
      nodes = _!
      return sankey
    },

    links(_?: SankeyLink[]) {
      if (!arguments.length) return links
      links = _!
      return sankey
    },

    size(_?: [number, number]) {
      if (!arguments.length) return size
      size = _!
      return sankey
    },

    layout(iterations: number) {
      computeNodeLinks()
      computeNodeValues()
      computeNodeBreadths()
      computeNodeDepths(iterations)
      computeLinkDepths()
      return sankey
    },

    relayout() {
      computeLinkDepths()
      return sankey
    },

    link() {
      let curvature = 0.5

      function link(d: SankeyLink): string {
        const source = d.source as SankeyNode
        const target = d.target as SankeyNode
        const x0 = source.x! + source.dx!
        const x1 = target.x!
        const xi = d3.interpolateNumber(x0, x1)
        const x2 = xi(curvature)
        const x3 = xi(1 - curvature)
        const y0 = source.y! + d.sy! + d.dy! / 2
        const y1 = target.y! + d.ty! + d.dy! / 2
        return `M${x0},${y0}C${x2},${y0} ${x3},${y1} ${x1},${y1}`
      }

      link.curvature = function (_?: number) {
        if (!arguments.length) return curvature
        curvature = +_!
        return link
      }

      return link
    },
  }

  // Populate the sourceLinks and targetLinks for each node.
  // Also, if the source and target are not objects, assume they are indices.
  function computeNodeLinks() {
    nodes.forEach((node) => {
      node.sourceLinks = []
      node.targetLinks = []
    })
    links.forEach((link) => {
      let source = link.source
      let target = link.target
      if (typeof source === 'number')
        source = link.source = nodes[source as number] as SankeyNode
      if (typeof target === 'number')
        target = link.target = nodes[target as number] as SankeyNode
      ;(source as SankeyNode).sourceLinks!.push(link)
      ;(target as SankeyNode).targetLinks!.push(link)
    })
  }

  // Compute the value (size) of each node by summing the associated links.
  function computeNodeValues() {
    nodes.forEach((node) => {
      node.value = Math.max(
        d3.sum(node.sourceLinks!, value),
        d3.sum(node.targetLinks!, value)
      )
    })
  }

  // Iteratively assign the breadth (x-position) for each node.
  // Nodes are assigned the maximum breadth of incoming neighbors plus one;
  // nodes with no incoming links are assigned breadth zero, while
  // nodes with no outgoing links are assigned the maximum breadth.
  function computeNodeBreadths() {
    let remainingNodes = nodes
    let nextNodes: SankeyNode[]
    let x = 0

    while (remainingNodes.length) {
      nextNodes = []
      remainingNodes.forEach((node) => {
        node.x = x
        node.dx = nodeWidth
        node.sourceLinks!.forEach((link) => {
          if (nextNodes.indexOf(link.target as SankeyNode) < 0) {
            nextNodes.push(link.target as SankeyNode)
          }
        })
      })
      remainingNodes = nextNodes
      ++x
    }

    moveSinksRight(x)
    scaleNodeBreadths((size[0] - nodeWidth) / (x - 1))
  }

  function moveSinksRight(x: number) {
    nodes.forEach((node) => {
      if (!node.sourceLinks!.length) {
        node.x = x - 1
      }
    })
  }

  function scaleNodeBreadths(kx: number) {
    nodes.forEach((node) => {
      node.x! *= kx
    })
  }

  function computeNodeDepths(iterations: number) {
    // D3 v7 migration: replace d3.nest() with d3.group()
    const grouped = d3.group(nodes, (d) => d.x!)
    const nodesByBreadth = Array.from(grouped.entries())
      .sort((a, b) => d3.ascending(a[0], b[0]))
      .map((d) => d[1])

    initializeNodeDepth()
    resolveCollisions()
    for (let alpha = 1; iterations > 0; --iterations) {
      relaxRightToLeft((alpha *= 0.99))
      resolveCollisions()
      relaxLeftToRight(alpha)
      resolveCollisions()
    }

    function initializeNodeDepth() {
      const ky = d3.min(nodesByBreadth, (nodes) => {
        return (
          (size[1] - (nodes.length - 1) * nodePadding) / d3.sum(nodes, value)
        )
      })!

      nodesByBreadth.forEach((nodes) => {
        nodes.forEach((node, i) => {
          node.y = i
          node.dy = node.value! * ky
        })
      })

      links.forEach((link) => {
        link.dy = link.value * ky
      })
    }

    function relaxLeftToRight(alpha: number) {
      nodesByBreadth.forEach((nodes) => {
        nodes.forEach((node) => {
          if (node.targetLinks!.length) {
            const y =
              d3.sum(node.targetLinks!, weightedSource) /
              d3.sum(node.targetLinks!, value)
            node.y! += (y - center(node)) * alpha
          }
        })
      })

      function weightedSource(link: SankeyLink) {
        return center(link.source as SankeyNode) * link.value
      }
    }

    function relaxRightToLeft(alpha: number) {
      nodesByBreadth
        .slice()
        .reverse()
        .forEach((nodes) => {
          nodes.forEach((node) => {
            if (node.sourceLinks!.length) {
              const y =
                d3.sum(node.sourceLinks!, weightedTarget) /
                d3.sum(node.sourceLinks!, value)
              node.y! += (y - center(node)) * alpha
            }
          })
        })

      function weightedTarget(link: SankeyLink) {
        return center(link.target as SankeyNode) * link.value
      }
    }

    function resolveCollisions() {
      nodesByBreadth.forEach((nodes) => {
        let node: SankeyNode = nodes[0]
        let dy: number
        let y0 = 0
        const n = nodes.length
        let i: number

        // Push any overlapping nodes down.
        nodes.sort(ascendingDepth)
        for (i = 0; i < n; ++i) {
          node = nodes[i]
          dy = y0 - node.y!
          if (dy > 0) node.y! += dy
          y0 = node.y! + node.dy! + nodePadding
        }

        // If the bottommost node goes outside the bounds, push it back up.
        dy = y0 - nodePadding - size[1]
        if (dy > 0) {
          y0 = node.y! -= dy

          // Push any overlapping nodes back up.
          for (i = n - 2; i >= 0; --i) {
            node = nodes[i]
            dy = node.y! + node.dy! + nodePadding - y0
            if (dy > 0) node.y! -= dy
            y0 = node.y!
          }
        }
      })
    }

    function ascendingDepth(a: SankeyNode, b: SankeyNode) {
      return a.y! - b.y!
    }
  }

  function computeLinkDepths() {
    nodes.forEach((node) => {
      node.sourceLinks!.sort(ascendingTargetDepth)
      node.targetLinks!.sort(ascendingSourceDepth)
    })
    nodes.forEach((node) => {
      let sy = 0
      let ty = 0
      node.sourceLinks!.forEach((link) => {
        link.sy = sy
        sy += link.dy!
      })
      node.targetLinks!.forEach((link) => {
        link.ty = ty
        ty += link.dy!
      })
    })

    function ascendingSourceDepth(a: SankeyLink, b: SankeyLink) {
      return (a.source as SankeyNode).y! - (b.source as SankeyNode).y!
    }

    function ascendingTargetDepth(a: SankeyLink, b: SankeyLink) {
      return (a.target as SankeyNode).y! - (b.target as SankeyNode).y!
    }
  }

  function center(node: SankeyNode) {
    return node.y! + node.dy! / 2
  }

  function value(link: SankeyLink | SankeyNode) {
    return (link as SankeyLink).value ?? (link as SankeyNode).value ?? 0
  }

  return sankey
}
