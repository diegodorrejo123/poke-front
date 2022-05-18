import { Component, OnInit } from '@angular/core';
import { IFavPokemon, IPokemonDetailGET, IPokemonForm, IPokemonGET } from 'src/app/models/pokemon';
import { PokemonService } from 'src/app/services/pokemon.service';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {

  pokemons: IPokemonGET[] = []
  favPokemons: IFavPokemon[] = []
  pokemon: IPokemonForm;
  sessionStorageName = 'fav-pokemon'
  editMode = false;

  constructor(
    private pokemonService: PokemonService
  ) { }

  ngOnInit(): void {
    this.getPokemons()
    this.getFavPokemons()
  }

  
  addPokemon(pokemon){
    this.editMode = false
    this.getPokemon(pokemon)
  }

  getPokemon(pokemon: IPokemonGET){
    const { name } = pokemon
    this.pokemonService.getPokemonByName(name).subscribe((res) => {
      this.pokemon = {
        image: res.sprites.other.home.front_default,
        name: res.name,
        types: res.types.map(x => x.type.name)
      }
    })
  }

  getFavPokemons(){
    const data = sessionStorage.getItem(this.sessionStorageName)
    if(!data){
      this.favPokemons = []
      return
    }
    this.favPokemons = JSON.parse(sessionStorage.getItem(this.sessionStorageName))
    console.log(this.favPokemons);
  }



  getPokemons(){
    this.pokemonService.getPokemons(10, 1).subscribe((res)=>{
      this.pokemons = res.results
    })
  }

  formSubmit(values: {alias: string, types: string[]}){
    if(this.editMode == false){
      if(this.pokemonExists(this.pokemon.name)){
        alert('Este pokemon ya está en su lista de favoritos')
        return
      }
      const pokemon: IFavPokemon = {
        alias: values.alias,
        name: this.pokemon.name,
        image: this.pokemon.image,
        types: values.types,
        createdAt: new Date()
      }
      console.log(values);
      this.getFavPokemons()
      this.favPokemons.push(pokemon)
      this.saveFavPokemon()
      this.getFavPokemons()
      return
    }
    const pokemonEdit = this.favPokemons[this.getFavPokemonIndex(this.pokemon.name)]
    pokemonEdit.alias = values.alias
    this.saveFavPokemon()
    this.getFavPokemons()
  }
    
  getFavPokemonIndex(name: string){
    return this.favPokemons.indexOf(this.favPokemons.find(x => x.name === name))
  }

  saveFavPokemon(){
    sessionStorage.setItem(this.sessionStorageName, JSON.stringify(this.favPokemons))
  }

  edit(pokemon){
    this.editMode = true
    this.pokemon = this.favPokemons.find(x => x.name == pokemon.name)
    console.log(this.pokemon);
  }

  pokemonExists(name):boolean{
    if(this.favPokemons.find(x => x.name == name)){
      return true
    }
    return false
  }

}
