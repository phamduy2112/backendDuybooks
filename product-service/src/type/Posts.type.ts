export interface User {
    id: number;
    full_name?: string;
    email?: string;
    password?: string;
    phone_number?: string;
    avatar_url?: string;
    nick_name?: string;
    birth_date?: Date;
    marriage_condition?: string;
    role: string;
    status: string;
    bio?: string;
    created_at?: Date;
    code?: Code[];
    comment_reactions?: CommentReaction[];
    comments?: Comment[];
    post_reactions?: PostReaction[];
    posts?: Post[];
    saved_posts?: SavedPost[];
  }
export interface Post {
    id: number;
    user_id: number;
    content: string;
    visibility?: string;
    created_at?: Date;
    updated_at?: Date;
    comments?: Comment[];
    post_images?: PostImage[];
    post_reactions?: PostReaction[];
    users?: User;
    saved_posts?: SavedPost[];
  }
  
  export interface Comment {
    id: number;
    post_id: number;
    user_id: number;
    parent_id?: number;
    content: string;
    created_at?: Date;
    updated_at?: Date;
    comment_reactions?: CommentReaction[];
    comments?: Comment;
    other_comments?: Comment[];
    posts?: Post;
    users?: User;
  }
  
  export interface PostReaction {
    id: number;
    post_id: number;
    user_id: number;
    reaction_type: string;
    created_at?: Date;
    posts?: Post;
    users?: User;
  }
  
  export interface SavedPost {
    id: number;
    post_id: number;
    user_id: number;
    created_at?: Date;
    posts?: Post;
    users?: User;
  }
  
  export interface CommentReaction {
    id: number;
    comment_id: number;
    user_id: number;
    reaction_type: string;
    created_at?: Date;
    comments?: Comment;
    users?: User;
  }
  
  export interface PostImage {
    id: number;
    post_id: number;
    image_url: string;
    created_at?: Date;
    posts?: Post;
  }
  export interface Code {
    id: number;
    user_id: number;
    value: string;
  }
  