import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadStatusComponent } from './upload-status.component';

describe('UploadStatusComponent', () => {
  let component: UploadStatusComponent;
  let fixture: ComponentFixture<UploadStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
