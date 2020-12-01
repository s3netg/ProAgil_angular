
import { Component, OnInit } from '@angular/core';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  eventos: Evento[] ;
  eventosFiltrados: Evento[]  ;
  imagemLargura  = 50;
  imagemMargem = 2;
  mostrarImagem = true;
  filtroLista  = '';


  constructor(private eventoService: EventoService ) {  }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.GetEventos();
  }
  
  AlternarImagem(): void{
    this.mostrarImagem = !this.mostrarImagem;
  
  }
  
  filtraPorEventos(): void {
    if ( this.filtroLista){
      this.eventosFiltrados = this.eventos.filter(
        evento => evento.tema.toLocaleLowerCase().indexOf(this.filtroLista.toLocaleLowerCase()) > -1
      );
    }else{
      this.eventosFiltrados = this.eventos;
    }

  }

  GetEventos(): void {
      
      this.eventoService.getAllEvento().subscribe((_evento: Evento[]) => {
        this.eventos = _evento;
        this.eventosFiltrados = _evento;
      }, error => console.log(error));
  }

}
