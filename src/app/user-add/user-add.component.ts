import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent {
  user: any = [];
  username = '';
  password = '';
  conf_password = '';
  ipAdress: string = '192.168.126.92';


  constructor(private http: HttpClient, private snackBar: MatSnackBar,private dialogRef: MatDialogRef<UserAddComponent>) {}

  register() {
    if (this.password === this.conf_password) {
    if (this.username && this.password) {
      const encodedUsername = encodeURIComponent(this.username);
      const encodedPassword = encodeURIComponent(this.password);

      this.http.get(`http://${this.ipAdress}:3000/api/user/register?uname=${encodedUsername}&upassword=${encodedPassword}`).subscribe(
        (response: any) => {
          this.user = response;
          if (this.user) {
            this.dialogRef.close(true);
            console.log('Registration successful');
          } else {
            console.log('Invalid registration');
          }
        },
        (error) => {
          this.openSnackBar("Username already exists");
        }
      );
    }
  } else {
    this.openSnackBar("Passwords need to be the same")
  }
}

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

}
