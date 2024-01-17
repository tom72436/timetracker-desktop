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

  constructor(private http: HttpClient,public dialog: MatDialog) {}


  ngOnInit() {
    this.getAll();
  }

  getAll(){
    this.http.get<any[]>('http://localhost:3000/api/data/constructionSite').subscribe(
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
      console.log(`Dialog result: ${result}`);
    });
  }
}
