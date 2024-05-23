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
  ipAdress: string = 'localhost';

  constructor(private http: HttpClient,public dialog: MatDialog) {}


  ngOnInit() {
    this.getAll();
  }

  getAll(){
    this.http.get<any[]>(`http://${this.ipAdress}:3000/api/users`).subscribe(

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
    const dialogRef = this.dialog.open(UserAddComponent, {
      data: { auth: 0 }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
