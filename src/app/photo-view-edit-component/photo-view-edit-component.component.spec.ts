import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoViewEditComponentComponent } from './photo-view-edit-component.component';

describe('PhotoViewEditComponentComponent', () => {
  let component: PhotoViewEditComponentComponent;
  let fixture: ComponentFixture<PhotoViewEditComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhotoViewEditComponentComponent]
    });
    fixture = TestBed.createComponent(PhotoViewEditComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
