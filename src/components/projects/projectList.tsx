import budgetSankeyWebp from '../../static/animated/budget-sankey.webp'
import redditWebp from '../../static/animated/reddit-visualization.webp'
import budgetSankeyImg from '../../static/images/budget-dashboard.jpg'
import congressMapImg from '../../static/images/congress-map.png'
import forceClustersImg from '../../static/images/force-clusters.png'
import gdpImg from '../../static/images/gdp.png'
import networkImg from '../../static/images/network.png'
import redditImg from '../../static/images/reddit-visualization.png'

export type ProjectType = {
  img: string
  webp?: string
  title: string
  description: string
  internalLink?: string
  externalLink?: string
  githubLink?: string
}

export const d3Projects: ProjectType[] = [
  {
    img: redditImg,
    webp: redditWebp,
    title: 'Reddit Visualization',
    description:
      "Fun visualization of the data fetched by putting '.json' at the end of most reddit URLs.",
    internalLink: '/legacy/reddit-visualization',
    githubLink: 'https://github.com/MasonChinkin/d3-projects',
  },
  {
    img: budgetSankeyImg,
    webp: budgetSankeyWebp,
    title: 'Federal Budget Sankey',
    description:
      'Sankeys were underutilized as a tool to communicate fiscal policy.',
    internalLink: '/legacy/federal-budget-sankey',
    githubLink: 'https://github.com/MasonChinkin/budgetSankey',
  },
  {
    img: networkImg,
    title: 'The Diplomatic Web in Syria',
    description:
      'Interactive D3 force layout showing the complicated web of relationships in 2014 Syria.',
    externalLink: 'https://masonchinkin.github.io/Diplomatic_Web_in_Syria/',
    githubLink: 'https://github.com/MasonChinkin/Diplomatic_Web_in_Syria',
  },
  {
    img: forceClustersImg,
    title: 'Playing with Force-Clusters',
    description:
      'Little animation I made to help understand d3.js force clusters',
    externalLink: 'https://masonchinkin.github.io/forceClusterAnimation/',
    githubLink: 'https://github.com/MasonChinkin/forceClusterAnimation',
  },
  {
    img: congressMapImg,
    title: '2016 Congressional Election Results',
    description:
      'Mapping 2016 congressional results. I cringe looking back at how I made the tooltip...',
    externalLink:
      'https://masonchinkin.github.io/2016_Congressional_Election_Map/',
  },
  {
    img: gdpImg,
    title: 'Interactive Breakdown of US GDP Growth',
    description: 'The first thing I made after learning the basics of d3.js.',
    externalLink: 'https://masonchinkin.github.io/transitionStackedBarChart/',
  },
]
