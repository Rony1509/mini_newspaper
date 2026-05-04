import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit, OnDestroy {
  allPosts: Post[]      = [];
  posts: Post[]         = [];
  displayed: Post[]     = [];
  toasts: Toast[]       = [];
  toastCounter          = 0;

  searchQuery  = '';
  pageSize     = 10;
  currentPage  = 0;
  hasMore      = false;
  loading      = false;

  // Form state
  showForm     = false;
  editingId: string | null = null;
  formTitle    = '';
  formBody     = '';
  formLoading  = false;

  today = new Date();

  private toastTimers: ReturnType<typeof setTimeout>[] = [];

  constructor(private svc: PostService) {}

  ngOnInit() { this.loadPosts(); }

  ngOnDestroy() { this.toastTimers.forEach(clearTimeout); }

  loadPosts() {
    this.loading = true;
    this.svc.getAll().subscribe({
      next: (data) => {
        this.allPosts = data;
        this.applySearch();
        this.loading = false;
      },
      error: () => {
        this.toast('Failed to load posts', 'error');
        this.loading = false;
      },
    });
  }

  applySearch() {
    const q = this.searchQuery.toLowerCase().trim();
    this.posts = q
      ? this.allPosts.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.body.toLowerCase().includes(q)
        )
      : [...this.allPosts];
    this.currentPage = 0;
    this.updateDisplayed();
  }

  updateDisplayed() {
    const end = (this.currentPage + 1) * this.pageSize;
    this.displayed = this.posts.slice(0, end);
    this.hasMore   = this.posts.length > end;
  }

  loadMore() {
    this.currentPage++;
    this.updateDisplayed();
  }

  openCreate() {
    this.editingId  = null;
    this.formTitle  = '';
    this.formBody   = '';
    this.showForm   = true;
  }

  openEdit(post: Post) {
    this.editingId  = post._id!;
    this.formTitle  = post.title;
    this.formBody   = post.body;
    this.showForm   = true;
  }

  cancelForm() {
    this.showForm = false;
    this.editingId = null;
  }

  submitForm() {
    if (!this.formTitle.trim() || !this.formBody.trim()) {
      this.toast('Title and body are required', 'error');
      return;
    }
    this.editingId ? this.doUpdate() : this.doCreate();
  }

  private doCreate() {
    const tempId = 'temp_' + Date.now();
    const optimistic: Post = {
      _id: tempId,
      title: this.formTitle,
      body: this.formBody,
      userId: 1,
      isNew: true,
    };
    this.allPosts.unshift(optimistic);
    this.applySearch();
    this.showForm   = false;
    this.formLoading = true;

    this.svc.create({ title: this.formTitle, body: this.formBody }).subscribe({
      next: (created) => {
        const idx = this.allPosts.findIndex((p) => p._id === tempId);
        if (idx !== -1) this.allPosts[idx] = { ...created, isNew: true };
        this.applySearch();
        this.formLoading = false;
        this.toast('Post created!', 'success');
      },
      error: () => {
        this.allPosts = this.allPosts.filter((p) => p._id !== tempId);
        this.applySearch();
        this.formLoading = false;
        this.toast('Failed to create post', 'error');
      },
    });
  }

  private doUpdate() {
    const id = this.editingId!;
    const prev = this.allPosts.find((p) => p._id === id);
    const snapshot = prev ? { ...prev } : null;

    const idx = this.allPosts.findIndex((p) => p._id === id);
    if (idx !== -1) {
      this.allPosts[idx] = {
        ...this.allPosts[idx],
        title: this.formTitle,
        body: this.formBody,
        isUpdated: true,
        isNew: false,
      };
    }
    this.applySearch();
    this.showForm    = false;
    this.formLoading = true;

    this.svc.update(id, { title: this.formTitle, body: this.formBody }).subscribe({
      next: (updated) => {
        const i = this.allPosts.findIndex((p) => p._id === id);
        if (i !== -1) this.allPosts[i] = { ...updated, isUpdated: true };
        this.applySearch();
        this.formLoading = false;
        this.toast('Post updated!', 'success');
      },
      error: () => {
        if (snapshot) {
          const i = this.allPosts.findIndex((p) => p._id === id);
          if (i !== -1) this.allPosts[i] = snapshot;
          this.applySearch();
        }
        this.formLoading = false;
        this.toast('Failed to update post', 'error');
      },
    });
  }

  deletePost(post: Post) {
    const id      = post._id!;
    const backup  = [...this.allPosts];

    this.allPosts = this.allPosts.filter((p) => p._id !== id);
    this.applySearch();

    this.svc.delete(id).subscribe({
      next: () => this.toast('Post deleted', 'success'),
      error: () => {
        this.allPosts = backup;
        this.applySearch();
        this.toast('Failed to delete post', 'error');
      },
    });
  }

  toast(message: string, type: 'success' | 'error') {
    const id = ++this.toastCounter;
    this.toasts.push({ id, message, type });
    const t = setTimeout(() => this.removeToast(id), 3500);
    this.toastTimers.push(t);
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }

  trackByPost(_: number, post: Post) { return post._id; }
  trackByToast(_: number, t: Toast)  { return t.id; }
}
