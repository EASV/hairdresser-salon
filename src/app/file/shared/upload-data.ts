export interface UploadData {
  uid: string;
  percentage: number;
  data: File | string;
  url?: string;
}
