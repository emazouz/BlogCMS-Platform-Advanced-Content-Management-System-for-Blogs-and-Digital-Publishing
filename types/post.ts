export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  featuredImage: string;
  category: string;
  excerpt?: string;
  tags: string[];
  author: any; // Can be string ID or populated object with username
  publishedAt: string | Date; // Can be string after serialization
  createdAt: string | Date;
  readingTime: number;
  status: string;
  scheduledFor: Date;
  rating: number;
  views: number;
  ratingCount: number;
  // Add other fields as needed
}
