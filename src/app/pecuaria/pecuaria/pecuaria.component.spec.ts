import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PecuariaComponent } from './pecuaria.component';

describe('PecuariaComponent', () => {
  let component: PecuariaComponent;
  let fixture: ComponentFixture<PecuariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PecuariaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PecuariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
