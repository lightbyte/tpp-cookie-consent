import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TppccBannerComponent } from './tppcc-banner.component';

describe('TppccBannerComponent', () => {
  let component: TppccBannerComponent;
  let fixture: ComponentFixture<TppccBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TppccBannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TppccBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
