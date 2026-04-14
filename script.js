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
      max-width: 900px;
      color: #2d3436;
      font-family: 'Poppins', sans-serif;
      margin: auto;
    }

    .grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 40px; }

    /* Buscador */
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
    
    /* Botones de Acción */
    .btn-info { background: #0984e3; color: white; font-size: 0.8rem; padding: 8px 15px; }
    .btn-add { background: #00b894; color: white; width: 100%; margin-top: 15px; }
    .btn-delete { background: #ff7675; color: white; padding: 5px 10px; font-size: 0.7rem; border-radius: 6px; }

    button:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }

    .pkm-card { border-radius: 20px; padding: 25px; text-align: center; border: 1px solid rgba(0,0,0,0.05); }
    .pkm-img { width: 150px; height: 150px; filter: drop-shadow(0 8px 10px rgba(0,0,0,0.2)); }
    
    .table-container { background: #fff; border-radius: 15px; padding: 15px; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 15px; color: #636e72; border-bottom: 2px solid #f1f2f6; }
    td { padding: 12px; border-bottom: 1px solid #f1f2f6; }
    .cap { text-transform: capitalize; }

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
    if (this.team.length >= 6) return alert("¡Equipo lleno!");
    if (this.team.find(p => p.id === this.pokemon.id)) return alert("Ya está en tu equipo.");
    this.team = [...this.team, this.pokemon];
  }

  deleteFromTeam(id) {
    this.team = this.team.filter(p => p.id !== id);
  }

  // MEJORA: Función unificada para mostrar todos los detalles
  showFullDetails(p) {
    // Obtenemos los tipos y los unimos con una coma
    const tipos = p.types.map(t => t.type.name).join(', ');
    
    alert(`📝 FICHA TÉCNICA: ${p.name.toUpperCase()}
    ---------------------------------
    🧬 Tipo(s): ${tipos}
    📏 Altura: ${p.height / 10} m
    ⚖️ Peso: ${p.weight / 10} kg`);
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
      <h1 style="text-align: center; color: #2d3436; margin-bottom: 30px;">PokéDashboard Pro</h1>
      
      <div class="grid">
        <div>
          <div class="search-box">
            <input type="text" placeholder="Nombre o ID..." .value="${this.bus}"
              @input=${(e) => this.bus = e.target.value}>
            <button class="btn-search" @click=${() => this.fetchPokemon()}>Buscar</button>
          </div>
          
          <button class="btn-random" @click=${() => this.fetchPokemon(Math.floor(Math.random() * 150) + 1)}>
            ✨ Sorpresa Aleatoria
          </button>

          ${this.pokemon ? html`
            <div class="pkm-card" style="background: linear-gradient(180deg, ${mainColor}44 0%, #ffffff 100%)">
              <img class="pkm-img" src="${this.pokemon.sprites.other['official-artwork'].front_default || this.pokemon.sprites.front_default}">
              <h2 class="cap" style="margin: 10px 0;">${this.pokemon.name}</h2>
              
              <button class="btn-info" @click=${() => this.showFullDetails(this.pokemon)}>
                Ver Detalles Completos
              </button>

              <button class="btn-add" @click=${this.addToTable}>Agregar al Equipo</button>
            </div>
          ` : html`<div style="text-align:center; padding: 40px; color: #b2bec3; border: 2px dashed #dfe6e9; border-radius: 20px;">
              Busca un Pokémon para empezar
            </div>`}
        </div>

        <div class="table-container">
          <h3 style="margin-top: 0;">Mi Equipo (${this.team.length}/6)</h3>
          <table>
            <thead>
              <tr>
                <th>Pokémon</th>
                <th>Nombre</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              ${this.team.map(p => html`
                <tr>
                  <td><img src="${p.sprites.front_default}" width="45"></td>
                  <td class="cap">
                    <strong>${p.name}</strong>
                    <div style="font-size: 0.65rem; color: #0984e3; cursor: pointer;" @click=${() => this.showFullDetails(p)}>
                      [ Ver Info ]
                    </div>
                  </td>
                  <td>
                    <button class="btn-delete" @click=${() => this.deleteFromTeam(p.id)}>Eliminar</button>
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