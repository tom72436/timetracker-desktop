import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  uid!: number;
  user: any[]=[];
  ipAdress: string = '192.168.126.92';
  absences!: any[];
  displayedColumns: string[] = ['von', 'bis', 'reason'];
  displayedColumns2: string[] = ['date', 'startTime', 'endTime', 'hoursWorked', 'Site'];
  constructionSiteMap: Map<number, string> = new Map();

  time!: any[];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.uid = this.route.snapshot.params['uid'];
    this.getDetails(this.uid);
    this.getAbsences(this.uid);
    this.getTime(this.uid);
  }

  getDetails(uid: number){
    this.http.get<any[]>(`http://${this.ipAdress}:3000/api/user/details?uid=${uid}`).subscribe(

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
      this.http.get(`http://${this.ipAdress}:3000/api/user/delete?uid=${uidParam}`).subscribe(

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

  getAbsences(uid: number){
    const uidParam = encodeURIComponent(uid.toString());
    this.http.get(`http://${this.ipAdress}:3000/api/user/absences?uid=${uidParam}`).subscribe(
      (response: any) => {
        this.absences = response;
        console.log(this.absences)
      },
      (error) => {
        console.error('Error fetching absences:', error);
        // Handle errors or show appropriate messages to the user
      }
    );
  }

  getTime(uid: number) {
    const uidParam = encodeURIComponent(uid.toString());
    this.http.get(`http://${this.ipAdress}:3000/api/timetracking/getAll?uid=${uidParam}`).subscribe(
      (response: any) => {
        this.time = response;
        // Extract unique cids
        const cids = [...new Set(this.time.map(item => item.cid))];
        // Fetch construction sites for each cid
        cids.forEach(cid => {
          this.getConstructionSite(cid).subscribe(constructionSites => {
            constructionSites.forEach(constructionSite => {
              this.constructionSiteMap.set(constructionSite.cid, constructionSite.cname);
            });
          });
        });
      });
  }


  calculateHoursWorked(startTime: string, endTime: string): string {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const millisecondsDiff = Math.abs(end.getTime() - start.getTime());
    const hours = Math.floor(millisecondsDiff / (1000 * 60 * 60));
    const minutes = Math.floor((millisecondsDiff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} hours ${minutes} minutes`;
  }

  getConstructionSite(cid: number): Observable<any[]> {
    const cidParam = encodeURIComponent(cid.toString());
    return this.http.get<any[]>(`http://${this.ipAdress}:3000/api/construction-sites/details?cid=${cidParam}`);
  }
}
