import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterBovineComponent } from './register-bovine.component';

describe('RegisterBovineComponent', () => {
  let component: RegisterBovineComponent;
  let fixture: ComponentFixture<RegisterBovineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterBovineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterBovineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
