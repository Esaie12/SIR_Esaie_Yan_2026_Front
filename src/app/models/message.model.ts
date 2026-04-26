export interface Message {
  id?: number;
  title: string;
  content?: string;
  userId?: number;
  groupeId?:number,
  senderId:number,
  dateSend: string; // ISO 8601 format
}
