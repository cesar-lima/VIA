'use client'
import './home.css'

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar/Navbar';
import Card from './components/Card/Card';
import Footer from './components/Footer/page';
import Location from './components/Location/Location';
import { getRestaurants } from './utils/supabase/store/restaurant';
import { getReviewsByRestaurantId } from './utils/supabase/store/review';
import { sortRestaurantsByProximity } from './utils/utils';
import Loading from './loading';

export default function Home() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userCep, setUserCep] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [locationChecked, setLocationChecked] = useState(false);

  useEffect(() => {
    async function loadRestaurants() {
      const result = await getRestaurants();
      if (result.success && result.data) {
        setRestaurants(result.data);
      }
      setLoading(false);
    }
    loadRestaurants();
  }, []);

  useEffect(() => {
    async function loadReviews() {
      setLoadingReviews(true);
      const allReviews: any[] = [];
      for (const restaurant of restaurants) {
        const result = await getReviewsByRestaurantId(restaurant.id_restaurant);
        if (result.success && result.data) {
          allReviews.push(...result.data);
        }
      }
      setReviews(allReviews);
      setLoadingReviews(false);
    }
    if (restaurants.length > 0) {
      loadReviews();
    }
  }, [restaurants]);

  // Filtra restaurantes pelo nome e endereço
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name_restaurant.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.adress_restaurant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordena por proximidade se houver CEP do usuário
  const sortedRestaurants = sortRestaurantsByProximity(filteredRestaurants, userCep);

  const handleCepDetected = (cep: string) => {
    setUserCep(cep);
    setLocationChecked(true);
  };

  const handleLocationDenied = () => {
    setLocationChecked(true);
  };

  // Função para calcular a média das avaliações
  const calculateAverageRating = (restaurantId: number) => {
    const restaurantReviews = reviews.filter(r => r.fk_id_restaurant === restaurantId);
    if (restaurantReviews.length === 0) return undefined;
    
    const sum = restaurantReviews.reduce((acc, review) => acc + review.rating_review, 0);
    return Number((sum / restaurantReviews.length).toFixed(1));
  };

  const isFullyLoaded = !loading && !loadingReviews && locationChecked;

  return (
    <section className="homepage">
      <Navbar />

      <section className="search-section">
        <Location onCepDetected={handleCepDetected} onLocationDenied={handleLocationDenied} />

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
          <input
            type="text"
            name="text"
            className="input"
            placeholder="Procure um restaurante aqui"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {!isFullyLoaded ? (
        <Loading />
      ) : (
        <main className="restaurants-list">
          {sortedRestaurants.map((restaurant: any) => (
            <Card
              key={restaurant.id_restaurant}
              id={restaurant.id_restaurant}
              name={restaurant.name_restaurant}
              address={restaurant.adress_restaurant}
              cep={restaurant.cep}
              nota={calculateAverageRating(restaurant.id_restaurant)}
              n_avaliacoes={reviews.filter(r => r.fk_id_restaurant === restaurant.id_restaurant).length}
            />
          ))}
        </main>
      )}

      <Footer />
    </section>
  );
}
