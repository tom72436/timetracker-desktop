import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-construction-site-details',
  templateUrl: './construction-site-details.component.html',
  styleUrls: ['./construction-site-details.component.scss']
})
export class ConstructionSiteDetailsComponent implements OnInit {
  cid!: number;
  site: any[] = [];
  ipAdress: string = '192.168.126.92';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit(){
    this.cid = this.route.snapshot.params['cid'];
    this.getDetails(this.cid);
  }

  getDetails(cid: number){
<<<<<<< HEAD
    this.http.get<any[]>(`http://${this.ipAdress}:3000/api/construction-sites/details?cid=${cid}`).subscribe(
=======
    this.http.get<any[]>('http://192.168.4.92:3000/api/construction-sites/details?cid=' + cid).subscribe(
>>>>>>> 95ae25498fac48704a9a34c2142df137a0d13302
      (response) => {
        this.site = response;
        console.log(this.site);
      },
      (error) => {
        console.error("No users found");
      }

    );
  }

  delete(cid: number) {
    if (confirm("Do you want to delete this user?")) {
<<<<<<< HEAD
    this.http.get(`http://${this.ipAdress}:3000/api/construction-sites/delete?cid=${cid}`).subscribe(
=======
    this.http.get('http://192.168.4.92:3000/api/construction-sites/delete?cid=' + cid).subscribe(
>>>>>>> 95ae25498fac48704a9a34c2142df137a0d13302
      (response: any) => {
        console.log('User deleted successfully');
        this.router.navigate(['/constuction-site']);
      },
      (error) => {
        console.error('Error deleting user:', error);
        // Handle errors or show appropriate messages to the user
      }
    );
  }

  }

}
