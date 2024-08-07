import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonSupportComponent } from './button-support.component';

describe('ButtonSupportComponent', () => {
  let component: ButtonSupportComponent;
  let fixture: ComponentFixture<ButtonSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonSupportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ButtonSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
