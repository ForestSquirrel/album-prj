import { Component } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

import { HttpClient } from "@angular/common/http";
import { MatDialogRef } from '@angular/material/dialog';

const URL = 'http://localhost:3001/api/v1/albums'; // URL to your server endpoint
@Component({
  selector: 'app-album-create',
  templateUrl: './album-create.component.html',
  styleUrls: ['./album-create.component.css']
})
export class AlbumCreateComponent {
  constructor(
    public dialogRef: MatDialogRef<AlbumCreateComponent>,
    private http: HttpClient,
  ) { }

  // Additional form data
  albumTitle = '';
  albumHashtags = '';

  visible = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  hashtags = ['ExampleHashtag'];

  ngOnInit() {
    this.albumTitle = '';
    this.albumHashtags = '';
  };

  create() {
    const albumData = {
      title: this.albumTitle,
      hashtags: this.hashtags.join(';')
    };
  
    this.http.post(URL, albumData).subscribe({
      next: () => {
        console.log('Created successfully');
        this.closeDialog();
      },
      error: (err) => {
        console.error('Error creating album:', err);
        // Handle the error, possibly show an error message to the user
      }
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our hashtag
    if (value) {
      this.hashtags.push(value);
      console.log(value);
    }
    // Clear the input value
    event.chipInput!.clear();
  }

  remove(hashtag: string): void {
    const index = this.hashtags.indexOf(hashtag);
    if (index >= 0) {
      this.hashtags.splice(index, 1);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}