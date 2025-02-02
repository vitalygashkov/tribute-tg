export type Goal = {
  id: number;
  name: string;
  description: string;
  image: {
    id: number;
    path: string;
    thumbnail: string;
    width: number;
    height: number;
    backId: number;
  };
  link: string;
  isDeleted: boolean;
};
