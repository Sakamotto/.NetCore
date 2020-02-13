import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  public registerForm: FormGroup;
  private user: User;

  constructor(public fb: FormBuilder, public toastr: ToastrService
    , private authService: AuthService
    , private router: Router) { }

  ngOnInit() {
    this.validation();
  }

  public validation() {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required,],
      passwords: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', Validators.required,]
      }, { validator: this.compararSenhas })
    });
  }

  public compararSenhas(fg: FormGroup) {
    const confirmSenhaCtrl = fg.get('confirmPassword');
    if (confirmSenhaCtrl.errors == null || 'mismatch' in confirmSenhaCtrl.errors) {
      if (fg.get('password').value !== confirmSenhaCtrl.value) {
        confirmSenhaCtrl.setErrors({ mismatch: true });
      } else {
        confirmSenhaCtrl.setErrors(null);
      }
    }
  }

  public cadastrarUsuario() {
    if (this.registerForm.valid) {
      this.user = Object.assign(
        { password: this.registerForm.get('passwords.password').value }, this.registerForm.value);

      this.authService.register(this.user)
        .subscribe(response => {
          this.toastr.success('Usuario cadastrado com sucesso!', 'Sucesso');
          this.router.navigate(['/user/login']);
        }, error => {
          const erro = error.error;
          erro.forEach(e => {
            switch (e) {
              case 'DuplicateUserName':
                this.toastr.error('Cadastro duplicado', 'Erro');
                break;
              default:
                this.toastr.error('Erro ao cadastrar usuário: ' + e.code, 'Erro');
                break;
            }
          });
        });
    }
  }

}
