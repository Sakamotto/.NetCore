import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public registerForm: FormGroup;

  constructor(public fb: FormBuilder, public toastr: ToastrService) { }

  ngOnInit() {
    this.validation();
  }

  public validation() {
    this.registerForm = this.fb.group({
      fullName : ['', Validators.required],
      email : ['', [Validators.required, Validators.email]],
      userName : ['', Validators.required, ],
      passwords: this.fb.group({
        password : ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword : ['', Validators.required, ]
      }, { validator: this.compararSenhas })
    });
  }

  public compararSenhas(fg: FormGroup) {
    const confirmSenhaCtrl = fg.get('confirmPassword');
    if (confirmSenhaCtrl.errors == null || 'mismatch' in confirmSenhaCtrl.errors) {
      if (fg.get('password').value !== confirmSenhaCtrl.value) {
        fg.get('password').setErrors({mismatch: true});
      } else {
        confirmSenhaCtrl.setErrors(null);
      }
    }
  }

  public cadastrarUsuario() {
    console.log('Cadastrar usuário');
  }

}
