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
      fullName : ['', Validators.required, Validators.email],
      email : ['', Validators.required, ],
      userName : ['', Validators.required, ],
      password : ['', Validators.required, Validators.minLength(4)],
      confirmPassword : ['', Validators.required, ],
    });
  }

  public cadastrarUsuario() {
    console.log('Cadastrar usuário');
  }

}
