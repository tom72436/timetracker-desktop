import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ConstructionSiteAddComponent } from '../construction-site-add/construction-site-add.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-construction-site',
  templateUrl: './construction-site.component.html',
  styleUrls: ['./construction-site.component.scss']
})
export class ConstructionSiteComponent {
  sites: any[] =[];
  ipAdress: string = '192.168.120.92';

  constructor(private http: HttpClient,public dialog: MatDialog) {}


  ngOnInit() {
    this.getAll();
  }

  getAll(){
    this.http.get<any[]>(`http://${this.ipAdress}:3000/api/construction-sites`).subscribe(

      (response) => {
        this.sites = response;
      },
      (error) => {
        console.error("No constructionSite found");
      }

    );
  }

  openDialog() {
    const dialogRef = this.dialog.open(ConstructionSiteAddComponent);

    dialogRef.afterClosed().subscribe(result => {
      window.location.reload();
      console.log(`Dialog result: ${result}`);
    });
  }
}
