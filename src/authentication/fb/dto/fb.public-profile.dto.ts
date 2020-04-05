export interface FbPublicProfileDto {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  name: string;
  name_format: string;
  short_name: string;
  picture: {
    data: {
      cache_key: string;
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
}
