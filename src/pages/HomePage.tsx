import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Footer } from '../components/Footer';

export function HomePage() {
  return (
    <div>
      <div className="absolute z-100 top-16 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 xl:top-10 xl:right-10">
        <a href="https://bolt.new/" target="_blank" rel="noopener noreferrer" className="cursor-pointer"><img src="/bolt.png" alt="" className="w-20 md:w-22 lg:w-24 xl:w-28 2xl:w-32" /></a>
      </div>
      <Header />
      <Hero />
      <Footer />
    </div>
  );
}