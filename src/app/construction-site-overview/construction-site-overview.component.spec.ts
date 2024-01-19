import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionSiteOverviewComponent } from './construction-site-overview.component';

describe('ConstructionSiteOverviewComponent', () => {
  let component: ConstructionSiteOverviewComponent;
  let fixture: ComponentFixture<ConstructionSiteOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructionSiteOverviewComponent]
    });
    fixture = TestBed.createComponent(ConstructionSiteOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
