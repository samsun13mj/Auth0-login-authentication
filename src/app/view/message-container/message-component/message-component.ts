import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { ChatService } from '../../../service/chat-container/chat-service';
import { ChatMessage } from '../../../service/chat-container/chat-model';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message-component.html',
  styleUrls: ['./message-component.scss']
})
export class ChatComponent implements OnInit {

  messageText = '';
  messages$!: Observable<ChatMessage[]>;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.messages$ = this.chatService.messages$;
  }

  send() {
    if (!this.messageText.trim()) return;

    this.chatService.sendMessage(this.messageText);
    this.messageText = '';
  }
}
