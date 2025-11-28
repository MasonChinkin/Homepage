// Theme constants and media query breakpoints

export const breakpoints = {
  phone: '450px',
  mobile: '768px',
  tablet: '1000px',
}

export const mediaQueries = {
  phone: `@media (max-width: ${breakpoints.phone})`,
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
}

export const colors = {
  background: '#090a0f',
  white: 'white',
  lightGray: 'lightgray',
  gray: 'rgb(148, 148, 148)',
  cornflowerblue: 'cornflowerblue',
  lightskyblue: 'lightskyblue',
  loadingGray: '#868686',
  loadingGrayDark: '#6d6d6d',
}

export const animations = {
  shimmerDuration: '0.7s',
  slideInDuration: '1s',
  transitionDuration: '0.25s',
  longTransitionDuration: '1s',
}
