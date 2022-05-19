import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IPokemonDetailGET, IPokemonFavorite, IPokemonResponse } from '../models/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly api: string = environment.pokeApi
  private readonly sessionKey = 'pokemons-favorites'
  constructor(
    private http: HttpClient
  ) { }

  getPokemons(limit: number, offset: number){
    return this.http.get<IPokemonResponse>(`${this.api}pokemon?limit=${limit}&offset=${offset}`)
  }


  getPokemonByName(name: string){
    return this.http.get<IPokemonDetailGET>(`${this.api}pokemon/${name}`)
  }

  getPokemonFavorites(): IPokemonFavorite[]{
    const session = sessionStorage.getItem(this.sessionKey)
    if(!session){
      return []
    }
    return JSON.parse(session)
  }

  addFavorite(pokemon: IPokemonFavorite): {success: boolean, message: string} {
    const pokemons = this.getPokemonFavorites()
    if(this.pokemonExists(pokemon.name)){
      return {
        success: false,
        message: 'Este pokemon ya está en su lista de favoritos'
      }
    }
    pokemon.createdAt = new Date()
    pokemons.push(pokemon)
    this.save(pokemons)
    return {
      success: true,
      message: 'Pokemon agregado a la lista de favoritos'
    }
  }

  updatePokemon(pokemon: IPokemonFavorite){
    const pokemons = this.getPokemonFavorites()
    const getPokemon = pokemons.find(x => x.name == pokemon.name)
    if(!getPokemon){
      return {
        success: false,
        message: 'No existe este pokemon en su lista de favoritos'
      }
    }
    const index = pokemons.indexOf(getPokemon)
    pokemons[index].alias = pokemon.alias
    console.log(pokemons);
    console.log(pokemon);
    this.save(pokemons)
    return {
      success: true,
      message: 'Datos guardados'
    }
  }

  getPokemonByNameSessionStorage(name:string){
    const pokemons = this.getPokemonFavorites()
    return pokemons.find(x => x.name == name)
  }

  delete(pokemon){
    const pokemons = this.getPokemonFavorites()
    const getPokemon = pokemons.find(x => x.name == pokemon.name)
    if(!getPokemon){
      return {
        success: false,
        message: 'No existe este pokemon en su lista de favoritos'
      }
    }
    const index = pokemons.indexOf(getPokemon)
    pokemons.splice(index, 1)
    this.save(pokemons)
    return {
      success: true,
      message: 'Pokemon eliminado de la lista'
    }
  }

  save(pokemons: IPokemonFavorite[]){
    sessionStorage.setItem(this.sessionKey, JSON.stringify(pokemons))
  }



  pokemonExists(name:string):boolean{
    let pokemons = this.getPokemonFavorites()
    const exists = pokemons.find(x => x.name == name)
    if(!exists){
      return false;
    }
    return true
  }
}
