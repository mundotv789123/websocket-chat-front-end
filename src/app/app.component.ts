import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message, WebsocketService } from './services/websocket.service';

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

  constructor(websocketService:WebsocketService) { 
    this.websocketService = websocketService;
    this.formGroup = new FormGroup({
      message: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.checkUsername();
    this.loadWebsocketListeners();
    this.websocketService.openConnection();
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
