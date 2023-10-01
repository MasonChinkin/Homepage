export type ProjectType = {
  img: string
  gif?: string
  title: string
  description: string
  liveLink: string
  githubLink?: string
}

export const d3Projects: ProjectType[] = [
  {
    img: 'images/redditvisualizations.png',
    gif: 'gifs/redditvisualizations.gif',
    title: 'Reddit Visualization',
    description:
      "Fun visualization of the data fetched by putting '.json' at the end of most reddit URLs.",
    liveLink: 'https://masonchinkin.com/d3-projects/reddit-visualization/',
    githubLink: 'https://github.com/MasonChinkin/d3-projects',
  },
  {
    img: 'images/budget-dashboard.jpg',
    gif: 'gifs/budget-dashboard.gif',
    title: 'Federal Budget Sankey',
    description:
      'Sankeys were underutilized as a tool to communicate fiscal policy.',
    liveLink: 'https://masonchinkin.github.io/budgetSankey/',
    githubLink: 'https://github.com/MasonChinkin/budgetSankey',
  },
  {
    img: 'images/network.png',
    title: 'The Diplomatic Web in Syria',
    description:
      'Interactive D3 force layout showing the complicated web of relationships in 2014 Syria.',
    liveLink: 'https://masonchinkin.github.io/Diplomatic_Web_in_Syria/',
    githubLink: 'https://github.com/MasonChinkin/Diplomatic_Web_in_Syria',
  },
  {
    img: 'images/force-clusters.png',
    title: 'Playing with Force-Clusters',
    description:
      'Little animation I made to help understand d3.js force clusters',
    liveLink: 'https://masonchinkin.github.io/forceClusterAnimation/',
    githubLink: 'https://github.com/MasonChinkin/forceClusterAnimation',
  },
  {
    img: 'images/congress-map.png',
    title: '2016 Congressional Election Results',
    description:
      'Mapping 2016 congressional results. I cringe looking back at how I made the tooltip...',
    liveLink: 'https://masonchinkin.github.io/2016_Congressional_Election_Map/',
  },
  {
    img: 'images/gdp.png',
    title: 'Interactive Breakdown of US GDP Growth',
    description: 'The first thing I made after learning the basics of d3.js.',
    liveLink: 'https://masonchinkin.github.io/transitionStackedBarChart/',
  },
]

export const otherProjects: ProjectType[] = [
  {
    img: 'images/availableflatsurface.png',
    gif: 'gifs/availableflatsurface.gif',
    title: 'AvailableFlatSurface',
    description:
      'A clone of OpenTable using a react/redux front end calling to a rails/PostgreSQL backend.',
    liveLink: 'https://available-flat-surface.herokuapp.com/#/',
    githubLink: 'https://github.com/MasonChinkin/availableFlatSurface',
  },
  {
    img: 'images/myphotojourney.png',
    title: 'MyPhotoJourney',
    description:
      'A MERN stack app that lets you upload photos from a trip, visualize them on a map, and share it for all to see!',
    liveLink: 'https://myphotojourney.herokuapp.com/#/',
    githubLink: 'https://github.com/MasonChinkin/MyPhotoJourney',
  },
]
