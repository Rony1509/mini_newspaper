import { Component } from '@angular/core';
import { PostsComponent } from './components/posts/posts.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [PostsComponent],
  template: `<app-posts />`,
})
export class AppComponent {}
