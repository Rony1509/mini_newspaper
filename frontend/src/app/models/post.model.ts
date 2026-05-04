export interface Post {
  _id?:       string;
  title:      string;
  body:       string;
  userId?:    number;
  createdAt?: string;
  updatedAt?: string;
  isNew?:     boolean;
  isUpdated?: boolean;
}
