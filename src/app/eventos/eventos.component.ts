import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  eventos: any = [];
  eventosFiltrados: any  = [];
  imagemLargura  = 50;
  imagemMargem = 2;
  mostrarImagem = true;
  filtroLista  = '';


  constructor(private http: HttpClient) {  }

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
      this.http.get('http://localhost:5000/api/ProAgil/').subscribe((resp) => {
        this.eventos = resp;
        this.eventosFiltrados = resp;
      }, error => console.log(error));
  }

}
