import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlbumCreateComponent } from '../album-create/album-create.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

const URL = 'http://localhost:3001/api/v1/albums'; // URL to your server endpoint

@Component({
  selector: 'app-album-page',
  templateUrl: './album-page.component.html',
  styleUrls: ['./album-page.component.css']
})
export class AlbumPageComponent {

  constructor(
    public dialog: MatDialog,
    private http: HttpClient,
    private router: Router
  ) { }
  
  items: AlbumItem[] = []; //retrieved albums
  displayedItems: AlbumItem[] = [];

  itemIdList: number[] = []; //retrieved albums ids
  itemTitles: Set<string> = new Set(); //retrieved albums titles
  itemHashtags: Set<string> = new Set(); //retrieved hashtags
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

  pageEvent: any;
  pageIndex: number = 0;
  pageSize: number = 5; // Set default page size
  emptyThumbURL: string = 'https://cdn.icon-icons.com/icons2/2483/PNG/512/empty_data_icon_149938.png';

  @ViewChild('hashtagInput') hashtagInput!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.resetComponent();
  }
  resetComponent() {
    this.http.get<AlbumItem[]>(URL).subscribe(data => {

      // Handle retrieved albums for rendering
      this.items = data; // Store all fetched albums
      this.updateDisplayedItems(); // Update displayed items for the current page
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

      this.titleControl.valueChanges.subscribe(value => {
        this.onTitleChanged(value);
      });
    })
  }
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(AlbumCreateComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      this.resetComponent();
    });
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
    this.fetchAlbums();
  }

  onHashtagSelectionChanged(newHashtags: string[]) {
    console.log('Hashtag selection changed:', newHashtags);
    this.filterHashtag = newHashtags.join(';');;
    this.fetchAlbums();
  }

  fetchAlbums() {
    let params = new HttpParams();

    if (this.filterTitle && this.filterTitle.trim() !== '') {
      params = params.set('title', this.filterTitle);
    }

    if (this.filterHashtag && this.filterHashtag.trim() !== '') {
      params = params.set('hashtag', this.filterHashtag);
    }

    this.http.get<AlbumItem[]>(URL, { params }).subscribe(data => {
      this.items = data; // Store filtered albums
      this.updateDisplayedItems(); // Update displayed items for the current page
    });
  }

  openAlbum(albumId: number) {
    // Handle opening the album, maybe navigate to a detail view
    console.log(`Opening album with ID: ${albumId}`);
    this.router.navigate(['/album', albumId]);
  }

  deleteAlbum(albumId: number) {
    // Handle deleting the album   
    const albumUrl = `${URL}/${albumId}`;
    this.http.delete(albumUrl).subscribe({
      next: () => {
        console.log(`Deleted album with ID: ${albumId}`);
        this.resetComponent();
      },
      error: (err) => {
        console.error('Error deleting album:', err);
      }
    }
    );
  }

  // Handle page events from paginator
  handlePageEvent(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedItems();
  }

  updateDisplayedItems() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedItems = this.items.slice(startIndex, endIndex);
  }
}

interface AlbumItem {
  id: number;
  title: string;
  hashtags: string;
  thumbPath: string;
  createdAt: string;
  updatedAt: string;
}

