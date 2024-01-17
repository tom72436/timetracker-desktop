import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user: any = [];
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router ) {}

  ngOnInit() {
    this.getLogin();
  }

  getLogin() {
    if (this.username || this.password) {
    const encodedUsername = encodeURIComponent(this.username);
    const encodedPassword = encodeURIComponent(this.password);

    this.http.get('http://localhost:3000/api/data/login?uname=' + encodedUsername + '&upassword=' + encodedPassword).subscribe(
      (response) => {
        // Assuming the server sends an array in response
        this.user = response;
        if (this.user && this.user.message === 'Login successful') {
          this.router.navigate(['/users']);
        } else {
          console.log('Invalid username or password');
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
    }
  }
}
