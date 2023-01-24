import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer';
import NextNProgress from 'nextjs-progressbar';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="container mx-auto font-sans">
        <Navbar />
        <NextNProgress />
        <main className='pb-32'>
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  );

}
