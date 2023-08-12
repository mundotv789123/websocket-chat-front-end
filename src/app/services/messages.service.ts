import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from './websocket.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  private httpClient: HttpClient;

  constructor(httpClient: HttpClient) { 
    this.httpClient = httpClient;
  }

  getMessages() : Observable<Message[]> {
    return this.httpClient.get<Message[]>(`${environment.apiUrl}/api/messages`);
  }
}
