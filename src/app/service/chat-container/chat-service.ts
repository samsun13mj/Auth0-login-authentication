import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatMessage } from './chat-model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private _messages = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this._messages.asObservable();

  /** USER MESSAGE */
  sendMessage(text: string) {
    const userMessage: ChatMessage = {
      id: Date.now(),
      text,
      sender: 'me',
      time: new Date().toLocaleTimeString()
    };

    this._messages.next([...this._messages.value, userMessage]);

    setTimeout(() => {
      this.botReply(text);
    }, 800);
  }

  /** BOT LOGIC */
  private botReply(userText: string) {
    const msg = userText.toLowerCase().trim();
    let replyText = '';

    // 👋 Greetings
    if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
      replyText = 'Hello 👋 How can I help you today?';
    }

    // 🙂 How are you
    else if (msg.includes('how are you')) {
      replyText = 'I am doing great 😊 Thanks for asking!';
    }

    // 🙏 Thanks
    else if (msg.includes('thank')) {
      replyText = 'You’re welcome! Happy to help 👍';
    }

    // 🛠 Help
    else if (msg.includes('help') || msg.includes('support')) {
      replyText = 'Sure! Please tell me what issue you are facing.';
    }

    // 💰 Pricing
    else if (msg.includes('price') || msg.includes('cost')) {
      replyText = 'Our pricing depends on the project. Can you share more details?';
    }

    // 👤 Who are you
    else if (msg.includes('who are you')) {
      replyText = 'I am Bezohminds Support Bot 🤖';
    }

    // ❓ Fallback
    else {
      replyText = 'I didn’t fully understand that 🤔 Can you explain a bit more?';
    }

    const botMessage: ChatMessage = {
      id: Date.now(),
      text: replyText,
      sender: 'other',
      time: new Date().toLocaleTimeString()
    };

    this._messages.next([...this._messages.value, botMessage]);
  }
}
