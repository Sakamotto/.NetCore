import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(
      private toastr: ToastrService
    , public authService: AuthService
    , private router: Router) { }

  ngOnInit() {
  }

  public loggedIn() {
    return this.authService.loggedIn();
  }

  public logout() {
    localStorage.removeItem('token');
    this.toastr.show('Log out');
    this.router.navigate(['/user/login']);
  }

  public entrar() {
    this.router.navigate(['/user/login']);
  }

  public userName() {
    return sessionStorage.getItem('userName'); 
  }

}
