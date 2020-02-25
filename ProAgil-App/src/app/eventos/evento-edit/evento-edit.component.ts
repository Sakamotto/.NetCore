import { Evento } from './../../models/Evento';
import { Component, OnInit } from '@angular/core';
import { EventoService } from 'src/app/services/evento.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-evento-edit',
  templateUrl: './evento-edit.component.html',
  styleUrls: ['./evento-edit.component.css']
})
export class EventoEditComponent implements OnInit {

  public titulo: string = 'Editar Evento';
  public registerForm: FormGroup;
  public evento: Evento = new Evento();
  public imagemURL = 'assets/img/upload.png';
  private fileNameToUpdate: string;
  public dataAtual: string;
  public file: File;

  constructor(private eventoService: EventoService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
    , private activatedRoute: ActivatedRoute
  ) {
    this.localeService.use('pt-br');
  }

  get lotes(): FormArray {
    return <FormArray>this.registerForm.get('lotes');
  }

  get redesSociais(): FormArray {
    return <FormArray>this.registerForm.get('redesSociais');
  }

  ngOnInit() {
    this.validation();
    this.carregarEvento();
  }

  public carregarEvento() {
    const eventoId = +this.activatedRoute.snapshot.paramMap.get('id');
    this.eventoService.getEventosById(eventoId)
      .subscribe((evento: Evento) => {
        this.evento = Object.assign({}, evento);
        this.fileNameToUpdate = evento.imagemURL;
        this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;
        this.evento.imagemURL = '';

        this.registerForm.patchValue(this.evento);
        console.log('lotes: ', this.evento.lotes);
        this.evento.lotes.forEach(lote => {
          this.lotes.push(this.criaLote(lote));
        });

        this.evento.redesSociais.forEach(rede => {
          this.redesSociais.push(this.criaRedeSocial(rede));
        });
      });
  }


  validation() {
    this.registerForm = this.fb.group({
      // id: [],
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      imagemURL: [''],
      lotes: this.fb.array([]),
      redesSociais: this.fb.array([]),
    });
  }

  public criaLote(lote: any): FormGroup {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim]
    });
  }

  public criaRedeSocial(rede: any): FormGroup {
    return this.fb.group({
      id: [rede.id],
      nome: [rede.nome, Validators.required],
      url: [rede.url, Validators.required]
    });
  }

  public adicionarLote() {
    this.lotes.push(this.criaLote({ id: 0 }));
  }

  public adicionarRedeSocial() {
    this.redesSociais.push(this.criaRedeSocial({ id: 0 }));
    console.log('Redes: ', this.redesSociais);
  }

  public removerRedeSocial(id: number) {
    this.redesSociais.removeAt(id);
  }

  public removerLote(id: number) {
    this.lotes.removeAt(id);
  }

  public onFileChange(evento: any, file: FileList) {
    const reader = new FileReader();
    reader.onload = (event: any) => this.imagemURL = event.target.result;
    this.file = evento.target.files;
    reader.readAsDataURL(file[0]);
  }

  public salvarEvento() {
    if (this.registerForm.valid) {
      console.log('evento salvar: ', this.evento, this.evento.id);
      this.evento = Object.assign({ id: this.evento.id }, this.registerForm.value);
      console.log('evento pós assign: ', this.evento, this.evento.id, this.registerForm.value);
      this.evento.imagemURL = this.fileNameToUpdate;

      this.uploadImagem();

      this.eventoService.salvarEvento(this.evento, 'editar')
        .subscribe((novoEvento: Evento) => {
          this.toastr.success('Evento editado com sucesso!', 'Sucesso');
        }, error => this.toastr.error('Erro ao salvar informações do evento', 'Erro'));
    }
  }

  private uploadImagem() {
    if (this.registerForm.get('imagemURL').value !== '') {
      const url = this.imagemURL.split('\\')[2];

      this.eventoService.postUpload(this.file, this.fileNameToUpdate)
        .subscribe(() => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;
        });
    }

  }

}
