import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { environment } from 'src/environments/environment';

export interface Message {
  author: string,
  message: string,
  createdAt?: Date,
  me?: boolean
}

@Injectable({ providedIn: 'root' })
export class WebsocketService {

  public onMessage: Function | null = null;
  public onConnect: Function | null = null;
  public onError: Function | null = null;
  
  private client: Client;

  constructor() {
    this.client = new Client({
      brokerURL: environment.websocketUrl,
      connectionTimeout: 5000,
      reconnectDelay: 15,
      onConnect: () => {
        if (this.onConnect) {
          this.onConnect();
        }
        this.client.subscribe(environment.websocketTopicMessageChannel, message => {
          if (this.onMessage) {
            this.onMessage(JSON.parse(message.body));
          }
        });
      },
      onWebSocketError: (error) => {
        if (this.onError) {
          this.onError(error)
        }
      }
    });
  }

  openConnection() {
    this.client.activate();
  }

  sendMessage(message: Message) {
    if (!this.client.connected) {
      return;
    }
    this.client.publish({ 
      destination: environment.websocketAppMessageChannel, 
      body: JSON.stringify(message) 
    });
  }
  
}
