export interface Comment {
  name:      string;
  text:      string;
  createdAt?: string;
}

export interface Post {
  _id?:       string;
  title:      string;
  body:       string;
  userId?:    number;
  category?:  'sports' | 'politics' | 'entertainment';
  comments?:  Comment[];
  createdAt?: string;
  updatedAt?: string;
  isNew?:     boolean;
  isUpdated?: boolean;
}
