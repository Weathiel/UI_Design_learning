import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestartDialogComponentComponent } from './restart-dialog-component.component';

describe('RestartDialogComponentComponent', () => {
  let component: RestartDialogComponentComponent;
  let fixture: ComponentFixture<RestartDialogComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestartDialogComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestartDialogComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
