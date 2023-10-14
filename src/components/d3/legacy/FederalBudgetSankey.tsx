import Footer from './Footer'
import Header from './Header'
import Instructions from './components/federal-budget-sankey/Instructions'
import sankeyData from './components/federal-budget-sankey/utils/sankeyData.json'
import { sankeyDataContext } from './components/federal-budget-sankey/utils/sankeyDataContext'

const FederalBudgetSankey = () => {
  return (
    <div className="legacy">
      <Header title="Federal Budget Sankey" />
      <sankeyDataContext.Provider value={sankeyData}>
        <main>
          <Instructions />
          Cool stuff
        </main>
      </sankeyDataContext.Provider>
      <Footer />
    </div>
  )
}

export default FederalBudgetSankey
