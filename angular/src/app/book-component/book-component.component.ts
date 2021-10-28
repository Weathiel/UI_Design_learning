import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, createPlatform, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { config } from 'rxjs';
import { AgeRange } from '../models/AgeRange';
import { Book } from '../models/book';
import { JSONResponse } from '../models/JSONResponse';
import { BookService } from '../services/book-service';

@Component({
  selector: 'app-book-component',
  templateUrl: './book-component.component.html',
  styleUrls: ['./book-component.component.css']
})
export class BookComponentComponent implements OnInit {

  sort: Sort = { active: "", direction: "" };
  pageEvent: PageEvent = { length: 0, pageIndex: 0, pageSize: 5 };
  pageSizeOptions: number[] = [5, 10, 15];
  searchInput: string = "";
  lastSearch: string = "";

  displayedColumns: string[] = ['no', 'genre', 'title',
    'author', 'publisher', 'actions'];
  dataSource !: MatTableDataSource<Book>;

  constructor(private bookService: BookService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar) {
    this.getAll();
  }

  ngOnInit(): void {
  }

  getAll(): void {
    this.getCountedBooksLenght();
    this.bookService.getAll(this.pageEvent, this.sort, this.lastSearch).subscribe((books: Book[]) => {
      this.dataSource = new MatTableDataSource(books);
      this.searchInput = "";
    });
  }

  getCountedBooksLenght(): void {
    this.bookService.getCountedAllBooks(this.lastSearch).subscribe((jsonResponse: JSONResponse) => {
      this.pageEvent.length = jsonResponse.size;
    });
  }

  edit(id: number): void {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      width: '500px',
      data: { id: id }
    });

    dialogRef.afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getAll();
      }
    });

  }

  delete(id: number): void {
    this.bookService.delete(id).subscribe(() => {
      this.getAll();
    });
  }

  create(): void {
    const dialogRef = this.dialog.open(BookDialogComponent, {
      width: '500px',
      data: { id: null }
    });

    dialogRef.afterClosed().subscribe((isSuccess: boolean) => {
      if (isSuccess) {
        this.getAll();
      }
    });
  }

  sortTable(sort: Sort) {
    this.sort = sort;
    this.getAll();
  }

  pageChanged(event: PageEvent) {
    this.getAll();
  }

  onSearch() {
    this.pageEvent.pageIndex = 0;
    this.lastSearch = this.searchInput;
    this.pageEvent.previousPageIndex = 0;
    this.pageChanged(this.pageEvent);
  }

}

@Component({
  selector: 'app-books-dialog',
  templateUrl: 'books-dialog.html',
  styleUrls: ['./book-component.component.css']
})
export class BookDialogComponent implements AfterViewInit {
  @Input() book: Book = {
    id: -1,
    title: '',
    author: '',
    publisher: '',
    genre: '',
    ageRange: AgeRange.NULL
  };

  titleTouched = false;
  authorTouched = false;
  publisherTouched = false;
  genreTouched = false;

  titleError = "";
  authorError = "";
  publisherError = "";
  genreError = "";
  ageRangeError = "";

  public stateTypes = Object.values(AgeRange);

  public htmlTitle = '';

  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<BookDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private bookService: BookService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar) {
    this.createForm();
    this.htmlTitle = 'Create Book';
    if (this.data.id != null) {
      this.htmlTitle = 'Edit Book';
      bookService.getOne(this.data.id).subscribe((bookToUpdate: Book) => {
        this.book = bookToUpdate;
        const sel = document.getElementById('select');
        if (sel != null) {
          if (this.book.ageRange === AgeRange.NULL || this.book.ageRange == null) {
            Object.assign(sel.style, { borderColor: 'red' });
          } else {
            Object.assign(sel.style, { borderColor: 'black' });
          }
        }
      });
    }

  }

  createForm() {
    this.form = this.fb.group({
      title: [''],
      author: [''],
      publisher: [''],
      genre: [''],
    });
  }

  validateForm(): void {
    if (this.titleTouched) {
      this.validateInputGreaterThan('title', this.book.title.length, 2);
    }
    if (this.authorTouched) {
      this.validateInputGreaterThan('author', this.book.author.length, 2);
    }
    if (this.publisherTouched) {
      this.validateInputGreaterThan('publisher', this.book.publisher.length, 2);
    }
    if (this.genreTouched) {
      this.validateInputGreaterThan('genre', this.book.genre.length, 3);
    }
  }

  validateInputGreaterThan(id: string, length: number, greater: number): void {
    const sel = document.getElementById(id);
    console.log(sel);
    if (sel != null) {
      if (length < greater) {
        Object.assign(sel.style, { borderColor: 'red' });
        return;
      }
      Object.assign(sel.style, { borderColor: 'black' });
    }

  }

  validateInputRegex(id: string, st: string, regex: string, length: number, greater: number): void {
    const sel = document.getElementById(id);
    let regexp = new RegExp(regex);
    if (sel != null) {
      if (st.match(regexp) && length >= greater) {
        Object.assign(sel.style, { borderColor: 'black' });
        return;
      }
      Object.assign(sel.style, { borderColor: 'red' });
    }

  }

  ngAfterViewInit(): void {
    this.changeColor('title');
    this.changeColor('author');
    this.changeColor('publisher');
    this.changeColor('genre');
    this.form.controls.genre.valueChanges.subscribe((vak) => {
      this.validateInputRegex('genre', vak, '[a-zA-Z]+', vak.length, 3);
      if (vak.length < 3) {
        this.genreError = "Genre must have at least 3 characters!"
      } else if (!vak.match('[a-zA-Z]+')) {
        this.genreError = "Genre must have only characters!"
      } else {
        this.genreError = "";
      }
    })
    this.form.controls.title.valueChanges.subscribe((vak) => {
      this.validateInputGreaterThan('title1', vak.length, 2);
      if (vak.length < 2) {
        this.titleError = "Title must have at least 2 characters";
      } else {
        this.titleError = "";
      }
    })
    this.form.controls.author.valueChanges.subscribe((vak) => {
      this.validateInputGreaterThan('author', vak.length, 2);
      if (vak.length < 2) {
        this.authorError = "Author must have at least 2 characters";
      } else {
        this.authorError = "";
      }
    })
    this.form.controls.publisher.valueChanges.subscribe((vak) => {
      this.validateInputGreaterThan('publisher', vak.length, 2);
      if (vak.length < 2) {
        this.publisherError = "Publisher must have at least 2 characters";
      } else {
        this.publisherError = "";
      }
    })
  }

  onClick(): void {
    if (this.form.valid && this.book.ageRange != AgeRange.NULL) {

      if (this.book.id == -1 || this.book.id == null) {

        this.bookService.create(this.book).subscribe(() => {
          this._snackBar.open('Successfully added "' + this.book.title + '"!', "Dismiss", {
            panelClass: 'snackbar',
            duration: 5000
          });
          this.dialogRef.close(true);
        },
          (error: HttpErrorResponse) => {
            this._snackBar.open('' + error.error.message, "Dismiss", {
              panelClass: 'snackbar-error',
              duration: 5000
            });
          });

      } else if (this.book.id > -1) {
        this.bookService.update(this.book.id, this.book).subscribe(() => {
          this._snackBar.open('Successfully edited "' + this.book.title + '"!', "Dismiss",
            {
              panelClass: 'snackbar',
              duration: 5000
            }
          );
          this.dialogRef.close(true);
        },
          (err: HttpErrorResponse) => {
            this._snackBar.open('' + err.error.message, "Dismiss", {
              panelClass: 'snackbar-error',
              duration: 5000
            });
          });

      }

    }
  }

  closeDialog() {
    this.dialogRef.close(null);
  }

  ageRangeChange(e: any) {
    const sel = document.getElementById('select');
    if (sel != null) {
      if (e.target.value === AgeRange.NULL || this.book.ageRange == null) {
        Object.assign(sel.style, { borderColor: 'red' });
        this.ageRangeError = "Age recommendation is required!"
      } else {
        Object.assign(sel.style, { borderColor: 'black' });
        this.ageRangeError = "";
      }
    }

  }

  changeColor(e: string) {
    const sel = document.getElementById(e);
    if (sel != null) {
      Object.assign(sel.style, { borderColor: 'black' });
    }
  }
}
