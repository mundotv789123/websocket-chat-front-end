import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message, WebsocketService } from './services/websocket.service';
import { MessagesService } from './services/messages.service';
import { catchError, retry, throwError, timeout } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  @ViewChild('usernameButton') private usernameButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('audioNotification') private audioNotification!: ElementRef<HTMLAudioElement>;

  public connected: boolean = false;
  public error: string | false = false;
  
  public messages: Message[] = [];
  public textareaRow: number = 1;

  public formGroup: FormGroup;

  private websocketService: WebsocketService;
  private messageService: MessagesService;

  constructor(websocketService: WebsocketService, messageService: MessagesService) { 
    this.websocketService = websocketService;
    this.messageService = messageService;
    this.formGroup = new FormGroup({
      message: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.checkUsername();
    this.loadMessages();
  }

  loadMessages() {
    this.messageService.getMessages().pipe(
      retry(3),
      timeout(5000),
      catchError(() => {
        this.error = "Erro ao buscar histórico de mensagens..."
        return throwError(() => new Error(''));
      })
    ).subscribe((messages: Message[]) => {
      messages.forEach(message => {
        message.me = (message.author == localStorage.getItem('username'));
        this.messages.push(message);
      });
      this.loadWebsocketListeners();
    });
  }

  loadWebsocketListeners() {
    this.websocketService.onMessage = (message: Message) => {
      message.me = (message.author == localStorage.getItem('username'));
      this.messages.push(message);
      if (!message.me) {
        this.playNotification();
      }
    };
    this.websocketService.onConnect = () => {
      this.connected = true;
      this.error = false;
    };
    this.websocketService.onError = () => {
      this.connected = false;
      this.error = "Conexão perdida...";
    };
    this.websocketService.openConnection();
  }

  checkUsername(): boolean {
    let username = localStorage.getItem("username");
    if (username == null || username == "") {
      if (this.usernameButton) 
        this.usernameButton.nativeElement.click();
      return false;
    }
    return true;
  }

  updateRows() {
    let text: string = this.formGroup.controls['message'].value;
    this.textareaRow = text ? text.split("\n").length : 1;
  }
 
  sendMessage() {
    if (!this.checkUsername() || !this.formGroup.valid)
      return;

    let username: string = localStorage.getItem("username") ?? "";

    let message = this.formGroup.controls['message'].value;
    this.websocketService.sendMessage({author: username, message: message});

    this.formGroup.controls['message'].reset();
    this.updateRows();
  }

  playNotification() {
    if (this.audioNotification) {
      this.audioNotification.nativeElement.currentTime = 0;
      this.audioNotification.nativeElement.play();
    }
  }
}
