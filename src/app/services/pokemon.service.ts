import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IPokemonDetailGET, IPokemonResponse } from '../models/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly api: string = environment.pokeApi
  constructor(
    private http: HttpClient
  ) { }

  getPokemons(limit: number, offset: number){
    return this.http.get<IPokemonResponse>(`${this.api}pokemon?limit=${limit}&offset=${offset}`)
  }


  getPokemonByName(name: string){
    return this.http.get<IPokemonDetailGET>(`${this.api}pokemon/${name}`)
  }
}
