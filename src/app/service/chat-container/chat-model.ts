export interface ChatMessage {
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
}
