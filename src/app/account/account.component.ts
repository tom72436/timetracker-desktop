import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  user!: any[];

  constructor(private cs: CookieService, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.getDetails(this.cs.get('user'));
  }
  getDetails(uid: string) {
    this.http.get<any[]>('http://192.168.4.92:3000/api/user/details?uid=' + uid).subscribe(
      (response) => {
        this.user = response;
        console.log(this.user);
      },
      (error) => {
        console.error("No users found");
      }
    );
  }

  logout() {
    this.router.navigate(['/']);
    this.cs.deleteAll();
  }
}
