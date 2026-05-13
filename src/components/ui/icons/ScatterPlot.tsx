import type { SVGProps } from 'react'

const ScatterPlot = (props: SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 26 26"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    {...props}
  >
    <path d="M2 2v22h22v-2H4V2H2zm5 16a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm5-5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm7 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-3-9a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm5 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM9 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
  </svg>
)

export default ScatterPlot
