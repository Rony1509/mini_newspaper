import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  private apiUrl = 'http://localhost:3000/api/posts';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Post[]>              { return this.http.get<Post[]>(this.apiUrl); }
  getById(id: string): Observable<Post>    { return this.http.get<Post>(`${this.apiUrl}/${id}`); }
  create(post: Partial<Post>): Observable<Post>    { return this.http.post<Post>(this.apiUrl, post); }
  update(id: string, post: Partial<Post>): Observable<Post> { return this.http.put<Post>(`${this.apiUrl}/${id}`, post); }
  delete(id: string): Observable<any>      { return this.http.delete(`${this.apiUrl}/${id}`); }
}
