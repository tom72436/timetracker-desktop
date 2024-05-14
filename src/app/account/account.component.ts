import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {MatDialog } from '@angular/material/dialog';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export interface DialogData {
  animal: string;
  name: string;
  id: any;
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  animal: string | undefined;
  name: string | undefined;
  user!: any[];


  constructor(public dialog: MatDialog, private cs: CookieService, private http: HttpClient, private router: Router) {}

  openDialog(id: string): void {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      data: {id: id},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }



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
