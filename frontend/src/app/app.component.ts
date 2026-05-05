import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="app-shell">
      <header class="site-nav">
        <a routerLink="/" routerLinkActive="active">All News</a>
        <a routerLink="/sports" routerLinkActive="active">Sports</a>
        <a routerLink="/politics" routerLinkActive="active">Politics</a>
        <a routerLink="/entertainment" routerLinkActive="active">Entertainment</a>
      </header>
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .app-shell {
        min-height: 100vh;
      }
      .site-nav {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        background: var(--bg-secondary);
        padding: 1rem;
        border-bottom: 1px solid var(--border-color);
      }
      .site-nav a {
        color: var(--text-primary);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        text-decoration: none;
        padding: 0.5rem 0.75rem;
      }
      .site-nav a.active {
        color: var(--accent);
        border-bottom: 3px solid var(--accent);
      }
      .app-main {
        padding: 0 1rem 2rem;
      }
    `,
  ],
})
export class AppComponent {}
