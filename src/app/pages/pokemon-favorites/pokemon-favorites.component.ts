import Swal from "sweetalert2"
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IPokemonFavorite } from './../../models/pokemon';
import { PokemonService } from 'src/app/services/pokemon.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pokemon-favorites',
  templateUrl: './pokemon-favorites.component.html',
  styleUrls: ['./pokemon-favorites.component.css']
})
export class PokemonFavoritesComponent implements OnInit {
  show = false;
  edit =  false;
  itemsPerPage = 10
  page = 1
  totalPokemons;
  formIsInvalid = false;
  pokemons: IPokemonFavorite[] = []
  pokemon: IPokemonFavorite
  form: FormGroup
  constructor(
    private pokemonService: PokemonService,
    private formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      alias: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.getPokemons()
  }

  getPokemon(pokemon: IPokemonFavorite){
    this.show = true
    this.edit = false
    this.pokemon = pokemon
  }

  editing(pokemon: IPokemonFavorite){
    this.edit = true
    this.pokemon = pokemon
    if(pokemon.alias){
      this.form.patchValue({
        alias: pokemon.alias
      })
    }
  }

  deletePokemon(pokemon: IPokemonFavorite){
    const response = this.pokemonService.delete(pokemon)
    Swal.fire(response.message, '', response.success ? 'success' : 'error')
    if(response.success){
      this.getPokemons()
    }
  }
  
  save(){
    this.formIsInvalid = this.form.invalid
    if(this.formIsInvalid) return
    const pokemon: IPokemonFavorite = {
      ...this.pokemon,
      alias: this.form.get('alias').value.trim()
    }
    const response = this.pokemonService.updatePokemon(pokemon)
    Swal.fire(response.message, '', response.success ? 'success' : 'error')
    if(response.success == true){
      this.show = true
      this.edit = false
      this.resetForm()
      this.getPokemons()
      this.getPokemonByName(pokemon.name)
    }
  }
  
  pageChange(event){
    this.page = event; 
    this.pokemons = []; 
    this.getPokemons()
  }

  resetForm(){
    this.form.patchValue({
      alias: ''
    })
  }

  getPokemonByName(name:string){
    this.pokemon = this.pokemonService.getPokemonByNameSessionStorage(name)
  }

  getPokemons(){
    this.pokemons = this.pokemonService.getPokemonFavorites()
    this.totalPokemons = this.pokemons.length
  }

  getError(name:string){
    const field = this.form.get(name)
    if(field.hasError('required')){
      return 'Este campo es requerido'
    }
    return ''
  }

}
