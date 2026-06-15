import { Redirect, Route, Switch } from 'wouter'
import Background from './Background'
import About from './about/About'
import Header from './header/Header'
import Home from './home/Home'
import D3ProjectGrid from './projects/D3ProjectGrid'

export const Component = () => (
  <>
    <Background />
    <Header />
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/d3" component={D3ProjectGrid} />
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  </>
)
