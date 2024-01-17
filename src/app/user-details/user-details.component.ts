import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  uid!: number;
  user: any[]=[];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.uid = this.route.snapshot.params['uid'];
    this.getDetails(this.uid);
  }

  getDetails(uid: number){
    this.http.get<any[]>('http://localhost:3000/api/user/details?uid=' + uid).subscribe(
      (response) => {
        this.user = response;
        console.log(this.user);
      },
      (error) => {
        console.error("No users found");
      }

    );
  }

  delete(uid: number) {
      const uidParam = encodeURIComponent(uid.toString());
      if (confirm("Do you want to delete this user?")) {
      this.http.get('http://localhost:3000/api/user/delete?uid=' + uidParam).subscribe(
        (response: any) => {
          console.log('User deleted successfully');
          this.router.navigate(['/users']);
        },
        (error) => {
          console.error('Error deleting user:', error);
          // Handle errors or show appropriate messages to the user
        }
      );
    }

    }
  }
