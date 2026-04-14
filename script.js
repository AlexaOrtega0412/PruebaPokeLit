import {LitElement, html, css}

export class app extends LitElement{
    :host {
        display: block;
        background: white;
        padding: 2rem;
        border-radius: 15px;

    }

}

static properties ={
    pokemon: {type: Object},
    team: {type: Array},
    bus: {type: String}

};

constructor(){
    super();
    this.pokemon= null;
    this.team=[];
    this.bus= '';
}

async pokemon(param) {
    const term = param || this.bus.toLowerCase();
    if(!term) return;

    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon/${term}');
        if(!response.ok) throw new Error();
        this.pokemon = await response.json();
    }catch (e) {
        alert("Pokemon no encontrado");
    }
}

addToTable(){
    if(this.team.length >= 6) return alert ("6 Maximo");
    if(this.team.find(car => car.id === this.pokemon.id)) return alert("Ya existe");
}

render(){
    return html 
    <div class="grid">
    <div class="search-box"></div>
    <input type="text" placeholder="ID" @input=${(e) => this.bus = e.target.value}></input>
    <button class="btn-random" style= "width: 20px"
    @click=${() => this.pokemon(Math.random)}>

    ${this.}
}