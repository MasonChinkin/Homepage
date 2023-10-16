import { ChangeEventHandler } from 'react'

const Inputs = () => {
  // NOTE: This is old code ported to react. Forgive me!
  const handleSuggestionClick: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const input = document.getElementById('subreddit-input') as HTMLInputElement

    input.value = e?.target.value
    sessionStorage.clear() // onchange isn't triggering consistenty in #subreddit-input

    const select = document.getElementById('suggestions') as HTMLInputElement
    select.value = 'Suggestions'
  }

  return (
    <div className="inputs">
      <select onChange={handleSuggestionClick} id="suggestions">
        <option defaultValue="selected" value="Suggestions">
          ---- Suggestions ----
        </option>
        <option value="FoodPorn">FoodPorn</option>
        <option value="WholesomeMemes">WholesomeMemes</option>
        <option value="EarthPorn">EarthPorn</option>
        <option value="DataIsBeautiful">DataIsBeautiful</option>
        <option value="NotTheOnion">NotTheOnion</option>
      </select>
      <input
        className="clear-local"
        id="subreddit-input"
        name="subreddit"
        placeholder="subreddit name"
        type="text"
      />
      <select name="sort" className="clear-local" id="sort-input">
        <option defaultValue="selected" value="Sort">
          ----- Sort -----
        </option>
        <option value="hot">Hot</option>
        <option value="top">Top</option>
        <option value="new">New</option>
      </select>
      <select
        disabled
        name="Date Range"
        className="clear-local"
        id="date-range"
      >
        <option defaultValue="selected" value="">
          Past 24 Hours
        </option>
        <option value="Past Hour">Past Hour</option>

        {/* 24hr option is blank in reddit url */}
        <option value="week">Past Week</option>
        <option value="month">Past Month</option>
        <option value="year">Past Year</option>
        <option value="all">All Time</option>
      </select>
      <input className="submit" type="submit" value="Visualize!" />
    </div>
  )
}

export default Inputs
