import { useContext } from 'react'
import { sankeyDataContext } from './utils/sankeyDataContext'

const Instructions = () => {
  const context = useContext(sankeyDataContext)

  return (
    <section className="instructions">
      <h1>Instructions</h1>
      <ul>
        <li>Type in a subreddit or select from "suggestions"</li>
      </ul>
    </section>
  )
}

export default Instructions
