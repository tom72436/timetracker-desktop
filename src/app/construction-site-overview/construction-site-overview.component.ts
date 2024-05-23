import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-construction-site-overview',
  templateUrl: './construction-site-overview.component.html',
  styleUrls: ['./construction-site-overview.component.scss']
})
export class ConstructionSiteOverviewComponent implements OnInit {
  displayedColumns: string[] = ['siteName', 'summe'];
  dataSource = new MatTableDataSource<any>([]);
  users!: any[];
  sites: any[] = [];
  ipAdress: string = 'localhost';
  rows: any[] = [];
  columns: any[] = [{ prop: 'siteName', name: 'Site Name' }, { prop: 'summe', name: 'Summe' }];
  constructionSiteMap: Map<number, string> = new Map();
  time: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.getUsersAndSites();
  }

  getUsersAndSites() {
    this.http.get<any[]>(`http://${this.ipAdress}:3000/api/users`).subscribe(
      (usersResponse) => {
        this.users = usersResponse;
        this.updateDisplayedColumns();

        this.http.get<any[]>(`http://${this.ipAdress}:3000/api/construction-sites`).subscribe(
          (sitesResponse) => {
            this.sites = sitesResponse;
            this.createRows();
            this.calculateUserHours();
          },
          (error) => {
            console.error("No construction sites found");
          }
        );
      },
      (error) => {
        console.error("No users found");
      }
    );
  }

  updateDisplayedColumns() {
    this.displayedColumns = ['siteName', 'summe'];
    this.users.forEach((user, index) => {
      this.displayedColumns.push(`user${index}`);
    });
  }

  createRows() {
    const rows = this.sites.map(site => ({
      siteName: site.cname,
      summe: ''
    }));
    this.dataSource.data = rows;
    this.dataSource.paginator = this.paginator;
  }

  calculateUserHours() {
    const userTimeObservables = this.users.map(user => this.getTime(user.uid));
    forkJoin(userTimeObservables).subscribe(() => {
      this.sites.forEach(site => {
        const siteName = site.cname;
        const row = this.dataSource.data.find((r: any) => r.siteName === siteName);
        if (row) {
          row.summe = this.calculateTotalHours(site.cid);
          this.users.forEach((user, index) => {
            const userHours = this.calculateHoursForUserAndSite(user.uid, site.cid);
            row[`user${index}`] = userHours;
          });
        }
      });
      this.dataSource._updateChangeSubscription(); // Refresh the table
    });
  }

  getTime(uid: number): Observable<any> {
    const uidParam = encodeURIComponent(uid.toString());
    return this.http.get(`http://${this.ipAdress}:3000/api/timetracking/getAll?uid=${uidParam}`).pipe(
      tap((response: any) => {
        this.time = this.time ? [...this.time, ...response] : response;
      })
    );
  }

  calculateTotalHours(cid: number): string {
    const siteTimes = this.time.filter(time => time.cid === cid);
    const totalMilliseconds = siteTimes.reduce((sum, time) => {
      const start = new Date(time.tdateStart);
      const end = new Date(time.tdateEnd);
      return sum + (end.getTime() - start.getTime());
    }, 0);
    return this.formatMilliseconds(totalMilliseconds);
  }

  calculateHoursForUserAndSite(uid: number, cid: number): string {
    const userTimes = this.time.filter(time => time.uid === uid && time.cid === cid);
    const totalMilliseconds = userTimes.reduce((sum, time) => {
      const start = new Date(time.tdateStart);
      const end = new Date(time.tdateEnd);
      return sum + (end.getTime() - start.getTime());
    }, 0);
    return this.formatMilliseconds(totalMilliseconds);
  }

  formatMilliseconds(milliseconds: number): string {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} hours ${minutes} minutes`;
  }

  getConstructionSite(cid: number): Observable<any[]> {
    const cidParam = encodeURIComponent(cid.toString());
    return this.http.get<any[]>(`http://${this.ipAdress}:3000/api/construction-sites/details?cid=${cidParam}`);
  }
}
