import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../services/evento.service';
import { Evento } from '../models/Evento';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  public eventosFiltrados: Evento[];
  public eventos: Evento[] = new Array<Evento>();
  public imagemLargura: number = 50;
  public imagemMargem: number = 2;
  public mostrarImagem: boolean = false;
  public modalRef: BsModalRef;

  public _filtroLista: string = "";

  constructor(private eventoService: EventoService, private modalService: BsModalService) { }

  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  public openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }


  ngOnInit() {
    this.getEventos();
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  filtrarEventos(filtro: string): Evento[] {
    filtro = filtro.toLocaleLowerCase();
    return this.eventos.filter(e => e.tema.toLocaleLowerCase().indexOf(filtro) !== - 1);
  }

  getEventos() {
    this.eventoService.getEventos()
      .subscribe((_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
        console.log('Response: ', _eventos);
      }, error => {
        console.log(error);
      });

  }
}
