import { IPokemonFavorite } from './../../models/pokemon';
import { OnInit, Component } from '@angular/core';
import { IPokemonDetailGET, IPokemonForm, IPokemonGET } from 'src/app/models/pokemon';
import { PokemonService } from 'src/app/services/pokemon.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  show = false;
  pokemons: IPokemonGET[] = []
  pokemon: IPokemonFavorite;

  constructor(
    private pokemonService: PokemonService
  ) { }

  ngOnInit(): void {
    this.getPokemons()
  }


  addPokemon(pokemon){
    this.getPokemon(pokemon)
  }

  getPokemon(pokemon: IPokemonGET){
    this.show = true
    const { name } = pokemon
    this.pokemonService.getPokemonByName(name).subscribe((res) => {
      this.pokemon = {
        image: res.sprites.other.home.front_default,
        name: res.name,
        types: res.types.map(x => x.type.name)
      }
    })
  }
  getPokemons(){
    this.pokemonService.getPokemons(10, 1).subscribe((res)=>{
      this.pokemons = res.results
    })
  }

  addToFavorites(){
    Swal.fire({
      title: `Añadirá a ${this.pokemon.name} a la lista de favoritos`,
      icon: 'info',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
        'Añadir',
      cancelButtonText:
        'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const response = this.pokemonService.addFavorite(this.pokemon)
        Swal.fire(response.message, '', response.success ? 'success' : 'error')
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }


}
