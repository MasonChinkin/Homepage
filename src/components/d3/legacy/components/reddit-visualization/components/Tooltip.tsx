const Tooltip = () => {
  return (
    <div id="tooltip" className="hidden">
      <h1>
        <span id="Subreddit">xxx</span>
      </h1>
      <h2>
        Title: <span id="Title">xxx</span>
      </h2>
      <h2>
        Posted: <span id="Posted">xxx</span>
      </h2>
      <h2>
        Upvotes: <span id="Upvotes">xxx</span>
      </h2>
      <img id="pic" alt="reddit post attachment" />
    </div>
  )
}

export default Tooltip
