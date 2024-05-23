import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  uid!: number;
  user: any[] = [];
  ipAdress: string = 'localhost';
  absencesDataSource = new MatTableDataSource<any>([]);
  timeDataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['von', 'bis', 'reason'];
  displayedColumns2: string[] = ['date', 'startTime', 'endTime', 'hoursWorked', 'Site'];
  constructionSiteMap: Map<number, string> = new Map();

  @ViewChild('paginatorAbsences') paginatorAbsences!: MatPaginator;
  @ViewChild('sortAbsences') sortAbsences!: MatSort;
  @ViewChild('paginatorTime') paginatorTime!: MatPaginator;
  @ViewChild('sortTime') sortTime!: MatSort;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.uid = Number(this.route.snapshot.params['uid']);
    this.getDetails(this.uid);
    this.getAbsences(this.uid);
    this.getTime(this.uid);
  }

  getDetails(uid: number) {
    this.http.get<any[]>(`http://${this.ipAdress}:3000/api/user/details?uid=${uid}`).subscribe(
      (response) => {
        this.user = response;
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
          this.router.navigate(['/users']);
        },
        (error) => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

  getAbsences(uid: number) {
    const uidParam = encodeURIComponent(uid.toString());
    this.http.get<any[]>(`http://${this.ipAdress}:3000/api/user/absences?uid=${uidParam}`).subscribe(
      (response) => {
        this.absencesDataSource.data = response;
        this.absencesDataSource.paginator = this.paginatorAbsences;
        this.absencesDataSource.sort = this.sortAbsences;
      },
      (error) => {
        console.error('Error fetching absences:', error);
      }
    );
  }

  getTime(uid: number) {
    const uidParam = encodeURIComponent(uid.toString());
    this.http.get<any[]>(`http://${this.ipAdress}:3000/api/timetracking/getAll?uid=${uidParam}`).subscribe(
      (response) => {
        this.timeDataSource.data = response;
        this.timeDataSource.paginator = this.paginatorTime;
        this.timeDataSource.sort = this.sortTime;

        // Extract unique cids
        const cids = [...new Set(response.map((item: any) => item.cid))];

        // Fetch construction sites for each cid
        cids.forEach((cid: number) => {
          this.getConstructionSite(cid).subscribe(constructionSites => {
            constructionSites.forEach((constructionSite: any) => {
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
