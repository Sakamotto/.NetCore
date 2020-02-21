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

  constructor(private eventoService: EventoService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
    , private activatedRoute: ActivatedRoute
  ) {
    this.localeService.use('pt-br');
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
        this.fileNameToUpdate = evento.imagemURL.toString();
        this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;
        this.evento.imagemURL = '';
        this.registerForm.patchValue(this.evento);

        this.evento.lotes.forEach(lote => {
          this.lotes.push(this.criaLote(lote));
        });

        this.evento.redesSociais.forEach(rede => {
          this.lotes.push(this.criaRedeSocial(rede));
        });
      });
  }

  get lotes(): FormArray {
    const a = this.registerForm.get('lotes') as FormArray;
    console.log(a, a.controls);
    return this.registerForm.get('lotes') as FormArray;
  }

  get redesSociais(): FormArray {
    return this.registerForm.get('redesSociais') as FormArray;
  }

  validation() {
    this.registerForm = this.fb.group({
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
  }

  public removerRedeSocial(id: number) {
    this.redesSociais.removeAt(id);
  }

  public removerLote(id: number) {
    this.lotes.removeAt(id);
  }

  public onFileChange(file: FileList) {
    const reader = new FileReader();
    reader.onload = (event: any) => this.imagemURL = event.target.result;
    reader.readAsDataURL(file[0]);
  }

}
