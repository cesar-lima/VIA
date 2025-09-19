import './style.css'

export default function Home() {
  return (
    <>
      <nav>
        <div>
          Avenida Indianópolis, 5321, Planalto Paulista
        </div>

        <div className="search">
          <input type="text" placeholder="digite o nome do restaurante"/>
        </div>
      </nav>

      <main>
        <div className="card-container">
          {/* componente de card criar */}
        </div>
      </main>
    </>
  );
}
