import './home.css'

import { MapPin } from 'lucide-react';
import Navbar from './components/Navbar/Navbar';
import Card from './components/Card/Card';
import Footer from './components/Footer/page';
import Location from './components/Location/Location';
import { getRestaurants } from './utils/supabase/store/restaurant';

export default async function Home() {
  const result = await getRestaurants();
  const restaurants = result.success ? result.data : [];

  return (
    <section className="homepage">
      <Navbar />

      <section className="search-section">
        <Location />

        <div className="search">
          <svg xmlns="http://www.w3.org/2000/svg" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            className="icon lucide lucide-search-icon lucide-search"
          >
            <path d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" />
          </svg>
          <input type="text" name="text" className="input" placeholder="Procure um restaurante aqui" />
        </div>
      </section>

      <main className="restaurants-list">
        {restaurants?.map((restaurant: any) => (
          <Card 
            key={restaurant.id_restaurant}
            id={restaurant.id_restaurant}
            name={restaurant.name_restaurant}
            address={restaurant.adress_restaurant}
            cep={restaurant.cep}
          />
        ))}
      </main>

      <Footer />
    </section>
  );
}
