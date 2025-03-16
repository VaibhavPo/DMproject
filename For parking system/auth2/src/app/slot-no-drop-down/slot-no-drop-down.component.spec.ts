import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotNoDropDownComponent } from './slot-no-drop-down.component';

describe('SlotNoDropDownComponent', () => {
  let component: SlotNoDropDownComponent;
  let fixture: ComponentFixture<SlotNoDropDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SlotNoDropDownComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlotNoDropDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
