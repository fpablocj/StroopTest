import { Component, OnInit } from '@angular/core';
import { Persona } from "../model/Persona"

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  constructor() { }

  persona:Persona = new Persona();
  estado: boolean = true;
  valido: boolean = true;
  personasGuardadas:Persona[]=[];

  errorID:string="";
  errorNombre:string="";


  ngOnInit(): void {
  }
    guardar(){
      this.borrar();
      this.validacion();
      if(this.valido==false){
        return;
      }

      if( this.estado == false){
        this.limpiar()
        this.estado=true
      }else{
        this.personasGuardadas.push(this.persona)
        this.limpiar();
      }
    }

    limpiar(){
      this.persona = new Persona();
    }

    eliminar(id:number){
      for(let i=0; i<= this.personasGuardadas.length; i++ ){
        if(this.personasGuardadas[i].id==id){
          this.personasGuardadas.splice(i, 1);
        }
      }
      this.limpiar();
    }
    actualizar(id:number){
      for(let i=0; i < this.personasGuardadas.length; i++){
        if(this.personasGuardadas[i].id == id){
          this.persona = this.personasGuardadas[i];
        }this.estado=false
      }
    }
    validacion(){
      if(this.persona.id <= 0){
        this.errorID="El ID de la Persona no puede ser Igual o menor a Cero"
        this.valido=false
      }
      if(this.estado==true){
        for(let i=0; i < this.personasGuardadas.length; i++){
          if(this.persona.id == this.personasGuardadas[i].id){
            this.errorID="El ID ingresado ya existe, ingrese un identificador distinto."
            return;
          }
        }
      }
      if(this.persona.nombre == ""){
        this.errorNombre="No ha ingresado el nombre de la persona"
        this.valido=false
      }

  }
  borrar(){
  this.errorID="";
  this.errorNombre="";
  this.valido=true
  }


}
