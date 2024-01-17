import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserAddComponent } from '../user-add/user-add.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  users: any[] =[];

  constructor(private http: HttpClient,public dialog: MatDialog) {}


  ngOnInit() {
    this.getAll();
  }

  getAll(){
    this.http.get<any[]>('http://localhost:3000/api/users').subscribe(
      (response) => {
        this.users = response;
        console.log(this.users);
      },
      (error) => {
        console.error("No users found");
      }

    );
  }
  openDialog() {
    const dialogRef = this.dialog.open(UserAddComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
