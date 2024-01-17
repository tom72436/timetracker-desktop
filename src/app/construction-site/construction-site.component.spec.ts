import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionSiteComponent } from './construction-site.component';

describe('ConstructionSiteComponent', () => {
  let component: ConstructionSiteComponent;
  let fixture: ComponentFixture<ConstructionSiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructionSiteComponent]
    });
    fixture = TestBed.createComponent(ConstructionSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
