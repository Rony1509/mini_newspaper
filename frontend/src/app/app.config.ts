import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { PostsComponent } from './components/posts/posts.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter([
      { path: '', component: PostsComponent, data: { category: 'all' } },
      { path: 'sports', component: PostsComponent, data: { category: 'sports' } },
      { path: 'politics', component: PostsComponent, data: { category: 'politics' } },
      { path: 'entertainment', component: PostsComponent, data: { category: 'entertainment' } },
      { path: '**', redirectTo: '', pathMatch: 'full' },
    ]),
  ],
};
