import { Evento } from './../../models/Evento';
import { Component, OnInit } from '@angular/core';
import { EventoService } from 'src/app/services/evento.service';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private eventoService: EventoService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private toastr: ToastrService
  ) {
    this.localeService.use('pt-br');
  }

  ngOnInit() {
    this.validation();
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
      lotes: this.fb.array([this.criaLote()]),
      redesSociais: this.fb.array([this.criaRedeSocial()]),
    });
  }

  public criaLote(): FormGroup {
    return this.fb.group({
      nome: ['', Validators.required],
      quantidade: ['', Validators.required],
      preco: ['', Validators.required],
      dataInicio: [''],
      dataFim: ['']
    });
  }

  public criaRedeSocial(): FormGroup {
    return this.fb.group({
      nome: ['', Validators.required],
      url: ['', Validators.required]
    });
  }

  public adicionarLote() {
    this.lotes.push(this.criaLote());
  }

  public adicionarRedeSocial() {
    this.redesSociais.push(this.criaRedeSocial());
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
