import { Component, OnInit, TemplateRef } from '@angular/core';
import { EventoService } from '../services/evento.service';
import { Evento } from '../models/Evento';
import { BsModalRef, BsModalService, ModalDirective } from 'ngx-bootstrap';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { defineLocale, BsLocaleService, ptBrLocale } from 'ngx-bootstrap';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  public eventosFiltrados: Evento[];
  public eventos: Evento[] = new Array<Evento>();
  public evento: Evento;
  public imagemLargura: number = 50;
  public imagemMargem: number = 2;
  public mostrarImagem: boolean = false;
  public modalRef: BsModalRef;
  public registerForm: FormGroup;
  private modoSalvamento: string = 'salvar';
  public bodyDeletarEvento: string;

  public _filtroLista: string = "";

  constructor(private eventoService: EventoService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
  ) {
    this.localeService.use('pt-br');
  }

  get filtroLista(): string {
    return this._filtroLista;
  }

  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  public openModal(template: any) {
    this.registerForm.reset();
    template.show(template);
  }


  ngOnInit() {
    this.validation();
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

  validation() {
    this.registerForm = this.fb.group({
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: ['', Validators.required]
    });
  }

  public editarEvento(template: any, evento: Evento) {
    this.openModal(template);
    this.modoSalvamento = 'editar';
    this.evento = evento;
    this.registerForm.patchValue(evento);
  }

  public novoEvento(template: any) {
    this.modoSalvamento = 'salvar';
    this.openModal(template);
  }

  public deletarEvento(template: any, evento: Evento) {
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja deletar o evento ${evento.tema} no ${evento.local}?`;
    this.openModal(template);
  }

  public salvarAlteracao(template: any) {
    if (this.registerForm.valid) {
      this.evento = Object.assign({ id: this.evento.id }, this.registerForm.value);
      this.eventoService.salvarEvento(this.evento, this.modoSalvamento)
        .subscribe((novoEvento: Evento) => {
          template.hide();
          this.getEventos();
        }, error => console.log(error));
    }
  }

  public confirmarDeleteEvento(template: any) {
    this.eventoService.delete(this.evento.id)
      .subscribe(() => {
        template.hide();
        this.getEventos();
      }, error => console.log(error));
  }

}
