import { Injectable } from '@angular/core';

export interface Message {
  author: string,
  message: string,
  me?: boolean
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  onMessage: Function | null = null;

  constructor() { }

  sendMessage(message: Message) {
    if (this.onMessage)
      this.onMessage(message);
  }
  
}
