
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {ToastrService} from 'ngx-toastr';




defineLocale('pt-br',ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  eventos: Evento[] ;
  eventosFiltrados: Evento[]  ;
  evento: Evento;
  imagemLargura  = 50;
  imagemMargem = 2;
  mostrarImagem = true;
  filtroLista  = '';
  registerForm: FormGroup;
  modoSalvar='post';
  bodyDeletarEvento=''

  constructor(private eventoService: EventoService
              ,private modalService: BsModalService
              ,private fb: FormBuilder
              ,private localeService :BsLocaleService
              ,private toastr : ToastrService) {
                this.localeService.use('pt-br')

               }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.validation();
    this.GetEventos();
  }

  AlternarImagem(): void{
    this.mostrarImagem = !this.mostrarImagem;

  }
  editarEvento(evento: Evento,template :any){
    this.modoSalvar='put'
    this.openModal(template)
    this.evento=evento;
    this.registerForm.patchValue(evento);

  }
  novoEvento(template :any){
    this.modoSalvar='post'
    this.openModal(template)

  }

  validation(){
    this.registerForm= this.fb.group({
      tema: ['',[Validators.required,Validators.minLength(3),Validators.maxLength(50)]],
      local: ['',Validators.required],
      dataEvento: ['',Validators.required],
      qtdPessoas: ['',[Validators.required,Validators.max(120000)]],
      telefone:['',Validators.required],
      email: ['',[Validators.required,Validators.email]],
      imagemUrl : ['',Validators.required]

    })
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.tema}`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
          template.hide();
          this.GetEventos();
          this.toastr.success('Deletado com sucesso');
        }, error => {
          console.log(error);
          this.toastr.error('Erro ao tentar deletar');
        }
    );
  }

  salvarAlteracao(template){
    if(this.registerForm.valid){
      if(this.modoSalvar==='post'){
        this.evento= Object.assign({},this.registerForm.value);
        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento)=>{
            console.log(novoEvento);
            template.hide();
            this.GetEventos();
            this.toastr.success('Inserido com sucesso');
          }, error=>{
            console.log(error);
          }

        );
      }
    }
     if(this.modoSalvar==='put'){
      this.evento= Object.assign({id:this.evento.id},this.registerForm.value);
        this.eventoService.putEvento(this.evento).subscribe(
          (novoEvento: Evento)=>{
            console.log(novoEvento);
            template.hide();
            this.GetEventos();
            this.toastr.success('Alterado com sucesso');
          }, error=>{
            console.log(error);
          }

        );


    }


  }
  openModal(template : any){
    this.registerForm.reset();
    template.show()
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
