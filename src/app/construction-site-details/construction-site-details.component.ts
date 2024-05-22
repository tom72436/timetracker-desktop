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
  ipAdress: string = '192.168.120.92';
  users!: any[];
  rows: any[] = [];
  columns: any[] = [];
  time: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.cid = parseInt(this.route.snapshot.params['cid'], 10);
    console.log('CID:', this.cid);
    this.getDetails(this.cid);
    this.getUsersAndSites();
  }

  getDetails(cid: number) {
    this.http.get<any[]>(`http://${this.ipAdress}:3000/api/construction-sites/details?cid=${cid}`).subscribe(
      (response) => {
        this.site = response;
        console.log('Site details:', this.site);
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
          console.log('Site deleted successfully');
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
        console.log('Users:', this.users);
        this.createColumns();

        this.http.get<any[]>(`http://${this.ipAdress}:3000/api/timetracking/getAllAll`).subscribe(
          (timeResponse) => {
            this.time = timeResponse;
            console.log('Time data:', this.time);
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
    console.log('Creating columns');
    this.columns = [{ prop: 'date', name: 'Date' }];
    this.users.forEach((user, index) => {
      this.columns.push({ prop: `user${index}`, name: `${user.uname}` });
    });
    this.columns.push({ prop: 'dailySum', name: 'Daily Sum' });
    this.columns.push({ prop: 'monthlySum', name: 'Monthly Sum' });
    console.log('Columns:', this.columns);
  }

  createRows() {
    console.log('Creating rows');
    console.log('Time data:', this.time);

    // Ensure correct filtering
    const filteredTime = this.time.filter(time => {
      console.log(`Checking time entry: cid=${time.cid}, expected cid=${this.cid}, result=${time.cid === this.cid}`);
      return parseInt(time.cid, 10) === this.cid;
    });

    console.log('Filtered time data:', filteredTime);

    const uniqueDatesSet = new Set();
    for (const time of filteredTime) {
      const date = new Date(time.tdateStart).toISOString().split('T')[0];
      uniqueDatesSet.add(date);
    }
    const uniqueDates = Array.from(uniqueDatesSet);
    console.log('Unique dates:', uniqueDates);

    this.rows = uniqueDates.map(date => ({
      date: date,
      dailySum: '',
      monthlySum: ''
    }));
    console.log('Rows:', this.rows);
  }

  calculateUserHours() {
    console.log('Calculating user hours');
    this.rows.forEach(row => {
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
    console.log('Rows with calculated hours:', this.rows);
  }

  calculateHoursForUserAndDate(uid: number, date: string): string {
    console.log(`Calculating hours for user ${uid} on date ${date}`);
    const userTimes = [];
    for (const time of this.time) {
      const timeDate = new Date(time.tdateStart).toISOString().split('T')[0];
      console.log(`Checking time entry: uid=${time.uid}, cid=${time.cid}, tdateStart=${timeDate}, expected uid=${uid}, expected cid=${this.cid}, expected date=${date}`);
      if (time.uid === uid && time.cid === this.cid && timeDate === date) {
        userTimes.push(time);
      }
    }
    console.log(`User times for user ${uid} on date ${date}:`, userTimes);

    const totalMilliseconds = userTimes.reduce((sum, time) => {
      const start = new Date(time.tdateStart).getTime();
      const end = new Date(time.tdateEnd).getTime();
      return sum + (end - start);
    }, 0);
    return this.formatMilliseconds(totalMilliseconds);
  }

  calculateHoursForUserAndMonth(uid: number, month: string): string {
    console.log(`Calculating hours for user ${uid} in month ${month}`);
    const userTimes = [];
    for (const time of this.time) {
      const timeMonth = new Date(time.tdateStart).toISOString().split('T')[0].substring(0, 7);
      console.log(`Checking time entry: uid=${time.uid}, cid=${time.cid}, tdateStart=${timeMonth}, expected uid=${uid}, expected cid=${this.cid}, expected month=${month}`);
      if (time.uid === uid && time.cid === this.cid && timeMonth === month) {
        userTimes.push(time);
      }
    }
    console.log(`User times for user ${uid} in month ${month}:`, userTimes);

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
    return `${hours} hours ${minutes} minutes`;
  }

  parseHours(formattedString: string): number {
    const [hoursPart, minutesPart] = formattedString.split(' hours ');
    const hours = parseInt(hoursPart, 10);
    const minutes = parseInt(minutesPart.split(' minutes')[0], 10);
    return (hours * 60) + minutes;
  }
}
