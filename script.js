import { LitElement, html, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js';

export class PokemonApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      padding: 30px;
      border-radius: 20px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 1000px; 
      color: #2d3436;
      font-family: 'Poppins', sans-serif;
      margin: auto;
    }

    .grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 30px; }

    
    .search-box { 
      display: flex; gap: 10px; margin-bottom: 15px;
      background: #fff; padding: 5px; border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
    }
    input { flex: 1; border: none; padding: 12px; outline: none; font-family: inherit; font-size: 1rem; }
    
    button { 
      padding: 12px 20px; border: none; border-radius: 10px; cursor: pointer; 
      font-weight: 600; transition: all 0.3s ease; font-family: inherit;
    }
    .btn-search { background: #6c5ce7; color: white; }
    .btn-random { background: #fab1a0; color: #d63031; width: 100%; margin-bottom: 20px; }
    .btn-add { background: #00b894; color: white; width: 100%; margin-top: 20px; }
    .btn-delete { background: #ff7675; color: white; padding: 6px 12px; font-size: 0.75rem; border-radius: 6px; }

    
    .pkm-card { border-radius: 20px; padding: 25px; text-align: center; border: 1px solid rgba(0,0,0,0.05); }
    .pkm-img { width: 150px; height: 150px; filter: drop-shadow(0 8px 10px rgba(0,0,0,0.2)); }
    
    
    .stats-container { display: flex; justify-content: space-around; margin-top: 15px; background: rgba(255,255,255,0.5); padding: 10px; border-radius: 12px; }
    .stat-item { display: flex; flex-direction: column; }
    .stat-label { font-size: 0.7rem; color: #636e72; text-transform: uppercase; }
    .stat-value { font-weight: 600; font-size: 1rem; }

    
    .table-container { background: #fff; border-radius: 15px; padding: 15px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 12px; color: #636e72; border-bottom: 2px solid #f1f2f6; font-size: 0.8rem; }
    td { padding: 10px 12px; border-bottom: 1px solid #f1f2f6; font-size: 0.9rem; }
    .cap { text-transform: capitalize; }
    .badge { padding: 4px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: bold; color: white; }

    @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
  `;

  static properties = {
    pokemon: { type: Object },
    team: { type: Array },
    bus: { type: String }
  };

  constructor() {
    super();
    this.pokemon = null;
    this.team = [];
    this.bus = '';
  }

  async fetchPokemon(param) {
    const term = param || this.bus.toLowerCase();
    if (!term) return;
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${term}`);
      if (!response.ok) throw new Error();
      this.pokemon = await response.json();
      this.bus = ''; 
    } catch (e) { alert("¡Pokémon no encontrado!"); }
  }

  addToTable() {
    if (this.team.length >= 6) return alert("¡Equipo completo!");
    if (this.team.find(p => p.id === this.pokemon.id)) return alert("Ya está en tu equipo.");
    this.team = [...this.team, this.pokemon];
  }

  deleteFromTeam(id) {
    this.team = this.team.filter(p => p.id !== id);
  }

  getTypeColor(type) {
    const colors = {
      fire: '#ff7675', water: '#74b9ff', grass: '#55efc4', electric: '#ffeaa7',
      bug: '#badc58', normal: '#dcdde1', poison: '#a29bfe', ground: '#e17055',
      fairy: '#fd79a8', fighting: '#fab1a0', psychic: '#a29bfe', rock: '#b2bec3',
      ghost: '#6c5ce7', ice: '#74b9ff', dragon: '#0984e3', steel: '#95afc0'
    };
    return colors[type] || '#dfe6e9';
  }

  render() {
    const mainColor = this.pokemon ? this.getTypeColor(this.pokemon.types[0].type.name) : '#fff';

    return html`
      <h1 style="text-align: center; margin-bottom: 25px;">Pokedex Pro</h1>
      
      <div class="grid">
        <div>
          <div class="search-box">
            <input type="text" placeholder="Nombre o ID..." .value="${this.bus}"
              @input=${(e) => this.bus = e.target.value}>
            <button class="btn-search" @click=${() => this.fetchPokemon()}>Buscar</button>
          </div>
          
          <button class="btn-random" @click=${() => this.fetchPokemon(Math.floor(Math.random() * 150) + 1)}>
            ✨ Generar Aleatorio
          </button>

          ${this.pokemon ? html`
            <div class="pkm-card" style="background: linear-gradient(180deg, ${mainColor}33 0%, #ffffff 100%)">
              <img class="pkm-img" src="${this.pokemon.sprites.other['official-artwork'].front_default || this.pokemon.sprites.front_default}">
              <h2 class="cap">${this.pokemon.name}</h2>
              
              <div class="stats-container">
                <div class="stat-item">
                  <span class="stat-label">Altura</span>
                  <span class="stat-value">${this.pokemon.height / 10} m</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Peso</span>
                  <span class="stat-value">${this.pokemon.weight / 10} kg</span>
                </div>
              </div>

              <button class="btn-add" @click=${this.addToTable}>Añadir al Equipo</button>
            </div>
          ` : html`<div style="text-align:center; padding: 40px; color: #b2bec3; border: 2px dashed #dfe6e9; border-radius: 20px;">
              Busca un Pokémon para ver sus detalles
            </div>`}
        </div>

        <div class="table-container">
          <h3 style="margin-top: 0;">Mi Equipo (${this.team.length}/6)</h3>
          <table>
            <thead>
              <tr>
                <th>Pokémon</th>
                <th>Datos</th>
                <th>Tipos</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              ${this.team.map(p => html`
                <tr>
                  <td><img src="${p.sprites.front_default}" width="45"></td>
                  <td>
                    <div class="cap"><strong>${p.name}</strong></div>
                    <div style="font-size: 0.75rem; color: #636e72;">
                      ${p.height / 10}m | ${p.weight / 10}kg
                    </div>
                  </td>
                  <td>
                    ${p.types.map(t => html`
                      <span class="badge" style="background: ${this.getTypeColor(t.type.name)}; margin-right: 4px;">
                        ${t.type.name}
                      </span>
                    `)}
                  </td>
                  <td>
                    <button class="btn-delete" @click=${() => this.deleteFromTeam(p.id)}>X</button>
                  </td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}

customElements.define('pokemon-app', PokemonApp);