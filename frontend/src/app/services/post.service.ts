import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private apiUrl = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    return throwError(() => ({
      status: error.status,
      message: error.error?.message || error.message || 'An error occurred',
      error: error.error
    }));
  }

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(this.apiUrl).pipe(catchError(e => this.handleError(e)));
  }
  getById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`).pipe(catchError(e => this.handleError(e)));
  }
  create(post: Partial<Post>): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post).pipe(catchError(e => this.handleError(e)));
  }
  update(id: string, post: Partial<Post>): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, post).pipe(catchError(e => this.handleError(e)));
  }
  addComment(id: string, comment: { name: string; text: string; }): Observable<Post> {
    return this.http.post<Post>(`${this.apiUrl}/${id}/comments`, comment).pipe(catchError(e => this.handleError(e)));
  }
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(catchError(e => this.handleError(e)));
  }
}
