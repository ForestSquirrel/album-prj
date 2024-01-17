import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PhotoUploadComponent } from 'src/app/photo-upload/photo-upload.component';
import { PhotoViewEditComponentComponent } from '../photo-view-edit-component/photo-view-edit-component.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import {
  GalleryModule,
  GalleryItem,
  ImageItem,
  ImageSize,
  ThumbnailsPosition,
  Gallery,
} from 'ng-gallery';
import { LightboxModule, Lightbox } from 'ng-gallery/lightbox';

const URL = 'http://localhost:3001/api/v1/photos'; // URL to your server endpoint

@Component({
  selector: 'app-photos-page',
  templateUrl: './photos-page.component.html',
  styleUrls: ['./photos-page.component.css']
})
export class PhotosPageComponent {

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    public gallery: Gallery,
    public lightbox: Lightbox,
    private router: Router
  ) { }

  items: GalleryItem[] = [];
  itemIdList: number[] = [];
  itemTitles: Set<string> = new Set();
  itemHashtags: Set<string> = new Set();
  titleControl = new FormControl();
  hashtagControl = new FormControl();
  filteredTitles: Observable<string[]> = of([]);
  filteredHashtags: Observable<string[]> = of([]);
  allTitles: string[] = []; // populated from your titles Set
  allHashtags: string[] = []; // populated from your hashtags Set
  selectedHashtags: string[] = [];
  hashtagCtrl = new FormControl('');
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filterTitle: string = ''; //search
  filterHashtag: string = ''; //search
  lightboxRef = this.gallery.ref('lightbox');

  @ViewChild('hashtagInput') hashtagInput!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.resetComponent();
  }
  resetComponent() {
    this.http.get<PhotoItem[]>(URL).subscribe(data => {

      this.items = data.map(
        item => new ImageItem({ src: item.filePath, thumb: item.filePath })
      );
      //List ids from db in separate variable
      this.itemIdList = data.map(item => item.id);

      data.forEach(item => {
        this.itemTitles.add(item.title);
        if (item.hashtags) {
          const tagsArray = item.hashtags.split(';'); // ';' is the delimiter
          tagsArray.forEach(tag => {
            this.itemHashtags.add(tag.trim()); // Add each tag to the set of hashtags
          });
        }
      })

      this.allTitles = Array.from(this.itemTitles);
      this.allHashtags = Array.from(this.itemHashtags);

      this.filteredTitles = this.titleControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(this.allTitles, value))
      );
      this.filteredHashtags = this.hashtagControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(this.allHashtags, value))
      );

      this.lightboxRef.setConfig({
        imageSize: ImageSize.Contain,
        thumbPosition: ThumbnailsPosition.Top,
      });

      this.lightboxRef.load(this.items);

      this.titleControl.valueChanges.subscribe(value => {
        this.onTitleChanged(value);
      });
    })
  }
  openUploadDialog(): void {
    const dialogRef = this.dialog.open(PhotoUploadComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.resetComponent();
    });
  }

  onItemClick(event: any): void {
    const dbId = this.itemIdList[event];
    console.log("Clicked on image", event, " dbId = ", dbId);
    const dialogRef = this.dialog.open(PhotoViewEditComponentComponent, {
      data: { photoId: dbId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.resetComponent();
    });
    // Handle the click event
    // 'event' typically contains information about the clicked item
  }

  private _filter(array: string[], value: string): string[] {
    const filterValue = value.toLowerCase();
    return array.filter(option => option.toLowerCase().includes(filterValue));
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.selectedHashtags.push(value);

    }
    event.chipInput!.clear();
    this.hashtagCtrl.setValue(null);
  }

  remove(hashtag: string): void {
    const index = this.selectedHashtags.indexOf(hashtag);
    if (index >= 0) {
      this.selectedHashtags.splice(index, 1);
      this.onHashtagSelectionChanged(this.selectedHashtags);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedHashtags.push(event.option.viewValue);
    this.hashtagInput.nativeElement.value = '';
    this.hashtagCtrl.setValue(null);
    this.onHashtagSelectionChanged(this.selectedHashtags);
  }

  onTitleChanged(newTitle: string) {
    console.log('Title changed:', newTitle);
    this.filterTitle = newTitle;
    this.fetchPhotos();
  }

  onHashtagSelectionChanged(newHashtags: string[]) {
    console.log('Hashtag selection changed:', newHashtags);
    this.filterHashtag = newHashtags.join(';');;
    this.fetchPhotos();
  }

  fetchPhotos() {
    let params = new HttpParams();

    if (this.filterTitle && this.filterTitle.trim() !== '') {
      params = params.set('title', this.filterTitle);
    }

    if (this.filterHashtag && this.filterHashtag.trim() !== '') {
      params = params.set('hashtag', this.filterHashtag);
    }

    this.http.get<PhotoItem[]>(URL, { params }).subscribe(data => {
      this.items = data.map(
        item => new ImageItem({ src: item.filePath, thumb: item.filePath })
      );
      this.itemIdList = data.map(item => item.id);
      this.lightboxRef.load(this.items);
    });
  }
}

interface PhotoItem {
  id: number;
  title: string;
  hashtags: string;
  fileName: string;
  filePath: string;
  createdAt: string;
  updatedAt: string;
}