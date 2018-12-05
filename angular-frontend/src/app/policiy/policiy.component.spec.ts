import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliciyComponent } from './policiy.component';

describe('PoliciyComponent', () => {
  let component: PoliciyComponent;
  let fixture: ComponentFixture<PoliciyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoliciyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliciyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
