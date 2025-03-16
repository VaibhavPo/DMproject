import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookQRComponent } from './book-qr.component';

describe('BookQRComponent', () => {
  let component: BookQRComponent;
  let fixture: ComponentFixture<BookQRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookQRComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookQRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
