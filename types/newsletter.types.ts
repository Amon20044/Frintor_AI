export interface Newsletter {
  uuid: string;
  title: string;
  description: string;
  content: string;
  img_url: string;
  metadata: Record<string, any>;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  is_published: boolean;
}
