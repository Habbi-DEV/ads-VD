export interface Profile {
  id: number;
  user_id: string;
  name: string | null;
  credits_balance: number;
  created_at: string;
}

export type ProjectStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Creative {
  id: number;
  project_id: number;
  video_url: string | null;
  script: string | null;
  voice_id: string | null;
  created_at: string;
}

export interface Project {
  id: number;
  user_id: string;
  product_name: string | null;
  product_url: string | null;
  image_url: string | null;
  description: string | null;
  price: string | null;
  language: string | null;
  tone: string | null;
  aspect_ratio: string | null;
  status: ProjectStatus;
  created_at: string;
  creative?: Creative | null;
}
