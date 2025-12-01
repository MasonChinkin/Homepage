const Visualization = () => {
  return (
    <>
      <p
        style={{ textAlign: 'left', margin: '0 auto 2rem', maxWidth: '100vh' }}
      >
        This was a little experiment to start understanding how to move nodes
        between clusters (
        <a href="https://flowingdata.com/2017/05/17/american-workday/">
          here is a fleshed out example
        </a>
        ). Interestingly, while d3 v4 has made the forced layout miles easier in
        general, there is a bit less customization available for clusters. Even
        Bostock <a href="https://bl.ocks.org/mbostock/7882658">used v3</a> well
        after the release of v4 to demonstrate clustering.
      </p>
      <div id="container" />
    </>
  )
}

export default Visualization
