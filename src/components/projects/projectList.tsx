import budgetSankeyWebp from '../../animated/budget-sankey.webp'
import redditWebp from '../../animated/reddit-visualization.webp'
import budgetSankeyImg from '../../images/budget-dashboard.jpg'
import congressMapImg from '../../images/congress-map.png'
import forceClustersImg from '../../images/force-clusters.png'
import gdpImg from '../../images/gdp.png'
import networkImg from '../../images/network.png'
import redditImg from '../../images/reddit-visualization.png'

export type ProjectType = {
  img: string
  webp?: string
  title: string
  description: string
  liveLink: string
  githubLink?: string
}

export const d3Projects: ProjectType[] = [
  {
    img: redditImg,
    webp: redditWebp,
    title: 'Reddit Visualization',
    description:
      "Fun visualization of the data fetched by putting '.json' at the end of most reddit URLs.",
    liveLink: 'https://masonchinkin.com/d3-projects/reddit-visualization/',
    githubLink: 'https://github.com/MasonChinkin/d3-projects',
  },
  {
    img: budgetSankeyImg,
    webp: budgetSankeyWebp,
    title: 'Federal Budget Sankey',
    description:
      'Sankeys were underutilized as a tool to communicate fiscal policy.',
    liveLink: 'https://masonchinkin.github.io/budgetSankey/',
    githubLink: 'https://github.com/MasonChinkin/budgetSankey',
  },
  {
    img: networkImg,
    title: 'The Diplomatic Web in Syria',
    description:
      'Interactive D3 force layout showing the complicated web of relationships in 2014 Syria.',
    liveLink: 'https://masonchinkin.github.io/Diplomatic_Web_in_Syria/',
    githubLink: 'https://github.com/MasonChinkin/Diplomatic_Web_in_Syria',
  },
  {
    img: forceClustersImg,
    title: 'Playing with Force-Clusters',
    description:
      'Little animation I made to help understand d3.js force clusters',
    liveLink: 'https://masonchinkin.github.io/forceClusterAnimation/',
    githubLink: 'https://github.com/MasonChinkin/forceClusterAnimation',
  },
  {
    img: congressMapImg,
    title: '2016 Congressional Election Results',
    description:
      'Mapping 2016 congressional results. I cringe looking back at how I made the tooltip...',
    liveLink: 'https://masonchinkin.github.io/2016_Congressional_Election_Map/',
  },
  {
    img: gdpImg,
    title: 'Interactive Breakdown of US GDP Growth',
    description: 'The first thing I made after learning the basics of d3.js.',
    liveLink: 'https://masonchinkin.github.io/transitionStackedBarChart/',
  },
]
