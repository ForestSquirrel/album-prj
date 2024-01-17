import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumViewEditPageComponent } from './album-view-edit-page.component';

describe('AlbumViewEditPageComponent', () => {
  let component: AlbumViewEditPageComponent;
  let fixture: ComponentFixture<AlbumViewEditPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlbumViewEditPageComponent]
    });
    fixture = TestBed.createComponent(AlbumViewEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
