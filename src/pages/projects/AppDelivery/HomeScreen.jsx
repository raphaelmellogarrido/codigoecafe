// src/pages/projects/AppDelivery/HomeScreen.jsx

import { Link } from 'react-router-dom';
import { HiStar, HiClock } from 'react-icons/hi';
import { restaurants } from './data';

export default function HomeScreen() {
  return (
    <div>
      <header className="dl-screen-header">
        <h1>Entregar em</h1>
        <p>Aveiro, Portugal</p>
      </header>

      <div className="dl-restaurant-list">
        {restaurants.map((r) => (
          <Link key={r.id} to={`/projetos/app-delivery/restaurantes/${r.id}`} className="dl-restaurant-card">
            <div
              className="dl-restaurant-thumb"
              style={{ backgroundImage: `${r.gradient}, url(${r.image})` }}
            />
            <div className="dl-restaurant-info">
              <h3>{r.name}</h3>
              <span className="dl-restaurant-category">{r.category}</span>
              <div className="dl-restaurant-meta">
                <span><HiStar /> {r.rating}</span>
                <span><HiClock /> {r.eta}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
