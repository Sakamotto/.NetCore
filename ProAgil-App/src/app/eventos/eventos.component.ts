import { Component, OnInit } from '@angular/core';
import { EventoService } from '../services/evento.service';
import { Evento } from '../models/Evento';
import { BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { defineLocale, BsLocaleService, ptBrLocale } from 'ngx-bootstrap';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  public titulo: string = 'Eventos';

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
  public dataAtual: string = '';
  public fileNameToUpdate: string = '';
  public file: File;

  constructor(private eventoService: EventoService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
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
    this.dataAtual = new Date().getMilliseconds().toString();
    this.eventoService.getEventos()
      .subscribe((_eventos: Evento[]) => {
        this.eventos = _eventos;
        this.eventosFiltrados = this.eventos;
        console.log('Response: ', _eventos);
      }, error => {
        this.toastr.error('Erro ao tentar carregar od eventos!', 'Erro');
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
    this.modoSalvamento = 'editar';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.fileNameToUpdate = evento.imagemURL.toString();
    this.evento.imagemURL = '';
    this.registerForm.patchValue(this.evento);
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

  private uploadImagem() {
    if (this.modoSalvamento === 'post') {
      const nomeArquivo = this.evento.imagemURL.split('\\', 3);
      this.evento.imagemURL = nomeArquivo[2];

      this.eventoService.postUpload(this.file, nomeArquivo[2])
        .subscribe(() => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        });
    }else {
      this.evento.imagemURL = this.fileNameToUpdate;
      this.eventoService.postUpload(this.file, this.fileNameToUpdate)
        .subscribe(() => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        });
    }
  }

  public salvarAlteracao(template: any) {
    if (this.registerForm.valid) {
      this.evento = Object.assign({ id: this.evento ? this.evento.id : 0 }, this.registerForm.value);

      this.uploadImagem();

      this.eventoService.salvarEvento(this.evento, this.modoSalvamento)
        .subscribe((novoEvento: Evento) => {
          if (this.modoSalvamento === 'editar') {
            this.toastr.success('Evento editado com sucesso!', 'Sucesso');
          } else {
            this.toastr.success('Evento salvo com sucesso!', 'Sucesso');
          }
          template.hide();
          this.getEventos();
        }, error => this.toastr.error('Erro ao salvar informações do evento', 'Erro'));
    }
  }

  public confirmarDeleteEvento(template: any) {
    this.eventoService.delete(this.evento.id)
      .subscribe(() => {
        this.toastr.success('Evento deletado com sucesso!', 'Sucesso');
        template.hide();
        this.getEventos();
      }, error => this.toastr.error('Erro ao deletar evento', 'Erro'));
  }

  public onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
    }
  }

}
