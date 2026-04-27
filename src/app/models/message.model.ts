export interface Message {
  id?: number;
  title: string;
  content?: string;
 userId: number | null;
  groupeId: number | null;
  senderId:number | null,
  dateSend: string; // ISO 8601 format
}
