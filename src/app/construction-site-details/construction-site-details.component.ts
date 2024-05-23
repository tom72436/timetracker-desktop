import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-construction-site-details',
  templateUrl: './construction-site-details.component.html',
  styleUrls: ['./construction-site-details.component.scss']
})
export class ConstructionSiteDetailsComponent implements OnInit {
  cid!: number;
  site: any[] = [];
  ipAdress: string = 'localhost';
  users!: any[];
  columns: any[] = [];
  time: any[] = [];
  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.cid = parseInt(this.route.snapshot.params['cid'], 10);
    this.getDetails(this.cid);
    this.getUsersAndSites();
  }

  getDetails(cid: number) {
    this.http.get<any[]>(`http://${this.ipAdress}:3000/api/construction-sites/details?cid=${cid}`).subscribe(
      (response) => {
        this.site = response;
      },
      (error) => {
        console.error("Error fetching site details:", error);
      }
    );
  }

  delete(cid: number) {
    if (confirm("Do you want to delete this site?")) {
      this.http.get(`http://${this.ipAdress}:3000/api/construction-sites/delete?cid=${cid}`).subscribe(
        (response: any) => {
          this.router.navigate(['/construction-site']);
        },
        (error) => {
          console.error('Error deleting site:', error);
        }
      );
    }
  }

  getUsersAndSites() {
    this.http.get<any[]>(`http://${this.ipAdress}:3000/api/users`).subscribe(
      (usersResponse) => {
        this.users = usersResponse;
        this.createColumns();

        this.http.get<any[]>(`http://${this.ipAdress}:3000/api/timetracking/getAllAll`).subscribe(
          (timeResponse) => {
            this.time = timeResponse;

            if (this.time && this.time.length > 0) {
              this.createRows();
              this.calculateUserHours();
            } else {
              console.warn('Time data is empty or invalid.');
            }
          },
          (error) => {
            console.error("Error fetching time data:", error);
          }
        );
      },
      (error) => {
        console.error("Error fetching users:", error);
      }
    );
  }

  createColumns() {
    this.columns = ['date', 'dailySum', 'monthlySum'];
    this.users.forEach((user, index) => {
      this.columns.splice(1, 0, `user${index}`);
    });
  }

  createRows() {
    const filteredTime = this.time.filter(time => parseInt(time.cid, 10) === this.cid);
    const uniqueDatesSet = new Set();
    for (const time of filteredTime) {
      const date = new Date(time.tdateStart).toISOString().split('T')[0];
      uniqueDatesSet.add(date);
    }
    const uniqueDates = Array.from(uniqueDatesSet);

    const rows = uniqueDates.map(date => ({
      date: date,
      dailySum: '',
      monthlySum: ''
    }));
    this.dataSource.data = rows;
    this.dataSource.paginator = this.paginator;
  }

  calculateUserHours() {
    this.dataSource.data.forEach(row => {
      const date = row.date;
      const month = date.substring(0, 7);
      let dailySum = 0;
      let monthlySum = 0;

      this.users.forEach((user, index) => {
        const userHoursForDay = this.calculateHoursForUserAndDate(user.uid, date);
        const userHoursForMonth = this.calculateHoursForUserAndMonth(user.uid, month);
        row[`user${index}`] = userHoursForDay;
        dailySum += this.parseHours(userHoursForDay);
        monthlySum += this.parseHours(userHoursForMonth);
      });

      row.dailySum = `${Math.floor(dailySum / 60)} hours ${dailySum % 60} minutes`;
      row.monthlySum = `${Math.floor(monthlySum / 60)} hours ${monthlySum % 60} minutes`;
    });

    this.dataSource._updateChangeSubscription();
  }

  calculateHoursForUserAndDate(uid: number, date: string): string {
    const userTimes = this.time.filter(time => {
      const timeDate = new Date(time.tdateStart).toISOString().split('T')[0];
      return time.uid === uid && time.cid === this.cid && timeDate === date;
    });

    const totalMilliseconds = userTimes.reduce((sum, time) => {
      const start = new Date(time.tdateStart).getTime();
      const end = new Date(time.tdateEnd).getTime();
      return sum + (end - start);
    }, 0);
    return this.formatMilliseconds(totalMilliseconds);
  }

  calculateHoursForUserAndMonth(uid: number, month: string): string {
    const userTimes = this.time.filter(time => {
      const timeMonth = new Date(time.tdateStart).toISOString().split('T')[0].substring(0, 7);
      return time.uid === uid && time.cid === this.cid && timeMonth === month;
    });

    const totalMilliseconds = userTimes.reduce((sum, time) => {
      const start = new Date(time.tdateStart).getTime();
      const end = new Date(time.tdateEnd).getTime();
      return sum + (end - start);
    }, 0);
    return this.formatMilliseconds(totalMilliseconds);
  }

  formatMilliseconds(milliseconds: number): string {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} h ${minutes} min`;
  }

  parseHours(formattedString: string): number {
    const [hoursPart, minutesPart] = formattedString.split(' h ');
    const hours = parseInt(hoursPart, 10);
    const minutes = parseInt(minutesPart.split(' min')[0], 10);
    return (hours * 60) + minutes;
  }

}
