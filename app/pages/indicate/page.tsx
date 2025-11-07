'use client';

import './style.css';

import Navbar from "@/app/components/Navbar/Navbar";

export default function Indicate() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica para enviar o formulário
        console.log('Formulário enviado!');
    };

    return (
        <section id="indicate-page">
            <Navbar />

            <h2>Indique seu restaurante favorito</h2>

            <form className="indicate-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="restaurant-name">Nome do Restaurante</label>
                    <input
                        id="restaurant-name"
                        name="restaurant-name"
                        required
                        placeholder="Digite o nome do restaurante..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="restaurant-address">Endereço do Restaurante</label>
                    <input
                        id="restaurant-address"
                        name="restaurant-address"
                        required
                        placeholder="Av. Exemplo, 123, Bairro - São Paulo - SP - CEP: 999999-999"
                    />
                </div>

                <div className="form-group">
                    <label>Ferramentas de Acessibilidade</label>
                    <div className="checkbox-group">
                        <label className="checkbox-item">
                            <input type="checkbox" name="acessibility" value="rampa" />
                            <span>Rampa de Acesso</span>
                        </label>
                        <label className="checkbox-item">
                            <input type="checkbox" name="acessibility" value="banheiro-adaptado" />
                            <span>Banheiro Adaptado</span>
                        </label>
                        <label className="checkbox-item">
                            <input type="checkbox" name="acessibility" value="elevador" />
                            <span>Elevador</span>
                        </label>
                        <label className="checkbox-item">
                            <input type="checkbox" name="acessibility" value="estacionamento" />
                            <span>Estacionamento Acessível</span>
                        </label>
                        <label className="checkbox-item">
                            <input type="checkbox" name="acessibility" value="cardapio-braille" />
                            <span>Cardápio em Braille</span>
                        </label>
                        <label className="checkbox-item">
                            <input type="checkbox" name="acessibility" value="sinalizacao-tatil" />
                            <span>Sinalização Tátil</span>
                        </label>
                        <label className="checkbox-item">
                            <input type="checkbox" name="acessibility" value="audio-descricao" />
                            <span>Áudio Descrição</span>
                        </label>
                        <label className="checkbox-item">
                            <input type="checkbox" name="acessibility" value="cadeira-rodas" />
                            <span>Espaço para Cadeira de Rodas</span>
                        </label>
                        <label className="checkbox-item">
                            <input type="checkbox" name="acessibility" value="interprete-libras" />
                            <span>Intérprete de Libras</span>
                        </label>
                        <label className="checkbox-item">
                            <input type="checkbox" name="acessibility" value="piso-tatil" />
                            <span>Piso Tátil</span>
                        </label>
                    </div>
                </div>

                <button type="submit" className="submit-button">
                    Enviar Indicação
                </button>
            </form>
        </section>
    )
}
