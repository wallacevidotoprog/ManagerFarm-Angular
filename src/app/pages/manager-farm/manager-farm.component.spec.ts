import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagerFarmComponent } from './manager-farm.component';

describe('ManagerFarmComponent', () => {
  let component: ManagerFarmComponent;
  let fixture: ComponentFixture<ManagerFarmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerFarmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagerFarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
