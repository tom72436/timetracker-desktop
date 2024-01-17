import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstructionSiteAddComponent } from './construction-site-add.component';

describe('ConstructionSiteAddComponent', () => {
  let component: ConstructionSiteAddComponent;
  let fixture: ComponentFixture<ConstructionSiteAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConstructionSiteAddComponent]
    });
    fixture = TestBed.createComponent(ConstructionSiteAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
