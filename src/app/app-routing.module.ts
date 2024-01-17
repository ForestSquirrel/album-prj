import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlbumPageComponent } from './album-page/album-page.component';
import { PhotosPageComponent } from './photos-page/photos-page.component';
import { AlbumViewEditPageComponent } from './album-view-edit-page/album-view-edit-page.component';
const routes: Routes = [
  {
    path: 'albums',
    component: AlbumPageComponent
  },
  {
    path: 'photo',
    component: PhotosPageComponent
  },
  {
    path: 'album/:id',
    component: AlbumViewEditPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
