export interface UserCreateDto {
  google_id: string;
  name: string;
  email: string;
  profile_pic_url?: string;
}