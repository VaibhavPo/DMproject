import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QRshowComponent } from './qrshow.component';

describe('QRshowComponent', () => {
  let component: QRshowComponent;
  let fixture: ComponentFixture<QRshowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QRshowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QRshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
