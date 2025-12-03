import budgetSankeyWebp from 'src/static/animated/budget-sankey.webp'
import redditWebp from 'src/static/animated/reddit-visualization.webp'
import budgetSankeyImg from 'src/static/images/budget-dashboard.jpg'
import congressMapImg from 'src/static/images/congress-map.png'
import forceClustersImg from 'src/static/images/force-clusters.png'
import gdpImg from 'src/static/images/gdp.png'
import networkImg from 'src/static/images/network.png'
import redditImg from 'src/static/images/reddit-visualization.png'

export type ProjectType = {
  img: string
  webp?: string
  title: string
  description: string
  internalLink?: string
  externalLink?: string
}

export const d3Projects: ProjectType[] = [
  {
    img: redditImg,
    webp: redditWebp,
    title: 'Reddit Visualization',
    description:
      "Fun visualization of the data fetched by putting '.json' at the end of most reddit URLs.",
    internalLink: '/reddit-visualization',
  },
  {
    img: budgetSankeyImg,
    webp: budgetSankeyWebp,
    title: 'Federal Budget Sankey',
    description:
      'Sankeys were underutilized as a tool to communicate fiscal policy.',
    internalLink: '/budget-sankey',
  },
  {
    img: networkImg,
    title: 'The Diplomatic Web in Syria',
    description:
      'Interactive D3 force layout showing the complicated web of relationships in 2014 Syria.',
    internalLink: '/syria-network',
  },
  {
    img: forceClustersImg,
    title: 'Playing with Force-Clusters',
    description:
      'Little animation I made to help understand d3.js force clusters',
    internalLink: '/force-cluster',
  },
  {
    img: congressMapImg,
    title: '2016 Congressional Election Results',
    description:
      'Mapping 2016 congressional results. I cringe looking back at how I made the tooltip...',
    internalLink: '/congress-map',
  },
  {
    img: gdpImg,
    title: 'Interactive Breakdown of US GDP Growth',
    description: 'The first thing I made after learning the basics of d3.js.',
    internalLink: '/gdp-growth',
  },
]
