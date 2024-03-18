import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TppccBlockComponent } from './tppcc-block.component';

describe('TppccBlockComponent', () => {
  let component: TppccBlockComponent;
  let fixture: ComponentFixture<TppccBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TppccBlockComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TppccBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
