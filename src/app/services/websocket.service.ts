import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { environment } from 'src/environments/environment';

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
  onConnect: Function | null = null;
  
  private client: Client;

  constructor() {
    this.client = new Client({
      brokerURL: environment.websocketUrl,
      onConnect: () => {
        if (this.onConnect) this.onConnect();
        this.client.subscribe(environment.websocketTopicMessageChannel, message => {
          if (this.onMessage) this.onMessage(JSON.parse(message.body));
        });
      }
    });
  }

  openConnection() {
    return this.client.activate();
  }

  sendMessage(message: Message) {
    if (this.client.connected)
      this.client.publish({ destination: environment.websocketAppMessageChannel, body: JSON.stringify(message) });
  }
  
}
