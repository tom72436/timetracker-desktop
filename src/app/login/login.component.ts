import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user: any = [];
  username: string = '';
  password: string = '';
  ipAdress: string = '192.168.126.92';

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

  ngOnInit() {
    this.getLogin();
  }

  getLogin() {
    if (this.username || this.password) {
    const encodedUsername = encodeURIComponent(this.username);
    const encodedPassword = encodeURIComponent(this.password);

    this.http.get(`http://${this.ipAdress}:3000/api/user/login?uname=${encodedUsername}&upassword=${encodedPassword}`).subscribe(
      (response) => {
        this.user = response;
        if (this.user && this.user.message === 'Login successful') {
          this.cookieService.set('user', this.user.user.uid);
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
