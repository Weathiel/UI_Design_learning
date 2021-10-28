import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { URL } from '../url';
import { Book } from '../models/book';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { JSONResponse } from '../models/JSONResponse';
import { AgeRange } from '../models/AgeRange';

@Injectable({ providedIn: 'root' })
export class BookService {


    constructor(private http: HttpClient,
        private url: URL) { }

    getAll(page: PageEvent, sort: Sort, searchInput: string) {
        // tslint:disable-next-line:max-line-length
        const params = new HttpParams()
            .set(`page`, (page.pageIndex).toString())
            .set(`size`, page.pageSize.toString())
            .set(`sortDir`, sort.direction)
            .set(`sortBy`, sort.active)
            .set(`search`, searchInput);
        return this.http.get<Book[]>(this.url.url + `book`, { params: params });
    }

    getCountedAllBooks(search: string) {
        const params = new HttpParams()
            .set(`search`, search);
        return this.http.get<JSONResponse>(this.url.url + `book/count`, { params: params });
    }

    getOne(id: number) {
        return this.http.get<Book>(this.url.url + `book/${id}`);
    }

    update(id: number, book: Book) {
        return this.http.put(this.url.url + `book/${id}`, book);
    }

    create(book: Book) {
        if (book.ageRange == AgeRange.NULL) {
            book.ageRange = AgeRange.NULL;
        }
        return this.http.post(this.url.url + `book`, book);
    }

    delete(id: number) {
        return this.http.delete(this.url.url + `book/${id}`);
    }
}