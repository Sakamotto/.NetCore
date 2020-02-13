import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public titulo: string = 'Login';
  public model: any = {};

  constructor(public toastr: ToastrService
    , private authService: AuthService
    , private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('token') != null) {
      this.router.navigate(['/dashboard']);
    }
  }

  public login() {
    this.authService.login(this.model)
      .subscribe(() => {
        this.router.navigate(['/dashboard']);
      }, error => {
        this.toastr.error('Falha ao tentar logar', 'Erro');
      });
  }

}
