import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  currentCategory: 'all' | 'sports' | 'politics' | 'entertainment' = 'all';
  categoryLabel  = 'All News';
  categoryDescription = 'Browse the latest headlines from every section.';

  // Form state
  showForm     = false;
  editingId: string | null = null;
  formTitle    = '';
  formBody     = '';
  formCategory: 'sports' | 'politics' | 'entertainment' = 'sports';
  formLoading  = false;

  newCommentName: Record<string, string> = {};
  newCommentText: Record<string, string> = {};
  commentLoading: Record<string, boolean> = {};

  today = new Date();

  private toastTimers: ReturnType<typeof setTimeout>[] = [];

  constructor(private svc: PostService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.currentCategory = data['category'] || 'all';
      this.updateCategoryText();
      this.loadPosts();
    });
  }

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
    const filtered = q
      ? this.allPosts.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.body.toLowerCase().includes(q)
        )
      : [...this.allPosts];

    this.posts = filtered.filter((p) =>
      this.currentCategory === 'all'
        ? true
        : p.category === this.currentCategory
    );
    this.currentPage = 0;
    this.updateDisplayed();
  }

  updateDisplayed() {
    const end = (this.currentPage + 1) * this.pageSize;
    this.displayed = this.posts.slice(0, end);
    this.hasMore   = this.posts.length > end;
  }

  updateCategoryText() {
    if (this.currentCategory === 'sports') {
      this.categoryLabel = 'Sports';
      this.categoryDescription = 'Catch the latest game coverage, scores, and sports features.';
    } else if (this.currentCategory === 'politics') {
      this.categoryLabel = 'Politics';
      this.categoryDescription = 'Read breaking political news, opinion, and analysis from every corner.';
    } else if (this.currentCategory === 'entertainment') {
      this.categoryLabel = 'Entertainment';
      this.categoryDescription = 'Discover celebrity news, pop culture stories, and entertainment highlights.';
    } else {
      this.categoryLabel = 'All News';
      this.categoryDescription = 'Browse the latest headlines from every section.';
    }
  }

  loadMore() {
    this.currentPage++;
    this.updateDisplayed();
  }

  openCreate() {
    this.editingId   = null;
    this.formTitle   = '';
    this.formBody    = '';
    this.formCategory = this.currentCategory !== 'all' ? this.currentCategory : 'sports';
    this.showForm    = true;
  }

  openEdit(post: Post) {
    this.editingId   = post._id!;
    this.formTitle   = post.title;
    this.formBody    = post.body;
    this.formCategory = post.category || 'sports';
    this.showForm    = true;
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
    if (!this.formCategory) {
      this.toast('Please choose a category', 'error');
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
      category: this.formCategory as any,
      userId: 1,
      isNew: true,
    };
    this.allPosts.unshift(optimistic);
    this.applySearch();
    this.showForm    = false;
    this.formLoading = true;

    this.svc.create({
      title: this.formTitle,
      body: this.formBody,
      category: this.formCategory,
    }).subscribe({
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

    this.svc.update(id, {
      title: this.formTitle,
      body: this.formBody,
      category: this.formCategory,
    }).subscribe({
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

  submitComment(post: Post) {
    const id = post._id;
    if (!id) return;

    const name = this.newCommentName[id]?.trim();
    const text = this.newCommentText[id]?.trim();

    if (!name || !text) {
      this.toast('Name and comment are required', 'error');
      return;
    }

    this.commentLoading[id] = true;
    this.svc.addComment(id, { name, text }).subscribe({
      next: (updated) => {
        const idx = this.allPosts.findIndex((p) => p._id === id);
        if (idx !== -1) {
          this.allPosts[idx] = updated;
        }
        this.applySearch();
        this.newCommentName[id] = '';
        this.newCommentText[id] = '';
        this.toast('Comment added successfully!', 'success');
        this.commentLoading[id] = false;
      },
      error: (err) => {
        const errMsg = err?.error?.message || err?.message || 'Failed to add comment';
        this.toast(`Error: ${errMsg}`, 'error');
        this.commentLoading[id] = false;
        console.error('Comment error:', err);
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
  trackByIndex(_: number) { return _; }
}
