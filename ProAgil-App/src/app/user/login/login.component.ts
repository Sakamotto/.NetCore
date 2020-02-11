import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public titulo: string = 'Login';
  public model: any;

  constructor(public router: Router) { }

  ngOnInit() {
  }

  public login() {

  }

}
