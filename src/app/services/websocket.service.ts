import { Injectable } from '@angular/core';
import { Client, Stomp } from '@stomp/stompjs';
import { environment } from 'src/environments/environment';

export interface Message {
  author: string,
  message: string,
  me?: boolean
}

const TOPIC: string = "/topic/messages" //TODO tira isso daí

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
        this.client.subscribe(TOPIC, message => {
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
      this.client.publish({ destination: TOPIC, body: JSON.stringify(message) });
  }
  
}
