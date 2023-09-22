import ThemeRegistry from '../muiconfigs/ThemeRegistry'
import '../styles/globals.css'
import { StoreProvider } from '../utils/store'

function MyApp({ Component, pageProps }) {
  return (
  <ThemeRegistry>
  <StoreProvider>

  <Component {...pageProps} />
  </StoreProvider>
  </ThemeRegistry>
  )
}

export default MyApp
