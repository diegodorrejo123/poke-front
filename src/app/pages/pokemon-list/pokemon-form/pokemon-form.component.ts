import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPokemonDetailGET, IPokemonForm } from 'src/app/models/pokemon';

@Component({
  selector: 'app-pokemon-form',
  templateUrl: './pokemon-form.component.html',
  styleUrls: ['./pokemon-form.component.css']
})
export class PokemonFormComponent implements OnInit, OnChanges {
  @Input() pokemon: IPokemonForm;
  form: FormGroup
  @Output() onSubmit = new EventEmitter<any>()
  constructor(
    private formBuilder: FormBuilder
  ) {
    this.form = this.formBuilder.group({
      alias: ['', Validators.required]
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(!this.pokemon?.alias){
      this.form.patchValue({
        alias: ''
      })
      return
    }
    this.form.patchValue({
      alias: this.pokemon.alias
    })
  }

  ngOnInit(): void {
    console.log(this.pokemon);
    
  }


  submit(){
    const pokemon = {
      alias: this.form.get('alias').value.trim(),
      name: this.pokemon.name,
      types: this.pokemon.types,
      image: this.pokemon.image
    }
    console.log(pokemon);
    this.resetForm()
    this.onSubmit.emit(pokemon)
  }

  resetForm(){
    this.form.patchValue({
      alias: ''
    })
  }

}
