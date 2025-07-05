import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterFarmComponent } from './register-farm.component';

describe('RegisterFarmComponent', () => {
  let component: RegisterFarmComponent;
  let fixture: ComponentFixture<RegisterFarmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterFarmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterFarmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
