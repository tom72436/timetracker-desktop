import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserAddComponent } from '../user-add/user-add.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-construction-site-add',
  templateUrl: './construction-site-add.component.html',
  styleUrls: ['./construction-site-add.component.scss']
})
export class ConstructionSiteAddComponent {
  user: any = [];
  username = '';
  description = '';

  constructor(private http: HttpClient, private snackBar: MatSnackBar,private dialogRef: MatDialogRef<UserAddComponent>) {}

  register() {
    if (this.username && this.description) {
      const encodedUsername = encodeURIComponent(this.username);
      const encodedDescription = encodeURIComponent(this.description);

      this.http.get('http://192.168.4.92:3000/api/construction-sites/register?cname=' + encodedUsername + '&cdescription=' + encodedDescription).subscribe(
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
  }

 openSnackBar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }

  }

