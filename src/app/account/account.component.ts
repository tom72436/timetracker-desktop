import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
<<<<<<< HEAD
import { Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { DeleteUserComponent } from '../delete-user/delete-user.component';

export interface DialogData {
  animal: string;
  name: string;
  id: any;
}
=======
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
>>>>>>> 95ae25498fac48704a9a34c2142df137a0d13302

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
<<<<<<< HEAD
  animal: string | undefined;
  name: string | undefined;

  constructor(public dialog: MatDialog) {}

  openDialog(id: string): void {
    const dialogRef = this.dialog.open(DeleteUserComponent, {
      data: {id: id},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
=======
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
>>>>>>> 95ae25498fac48704a9a34c2142df137a0d13302
  }
}
