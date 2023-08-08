import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message, WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  @ViewChild('usernameButton') usernameButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('audioNotification') audioNotification!: ElementRef<HTMLAudioElement>;

  connected:boolean = false;
  messages: Message[] = [];
  textareaRow: number = 1;

  private websocketService: WebsocketService;

  formGroup: FormGroup = new FormGroup({
    message: new FormControl('', [Validators.required])
  });

  constructor(websocketService:WebsocketService) { this.websocketService = websocketService }

  ngOnInit() {
    this.checkUsername();
    
    this.websocketService.onMessage = (message: Message) => {
      message.me = (message.author == localStorage.getItem('username'));
      this.messages.push(message);
      if (!message.me) {
        this.playNotification();
      }
    };
    this.websocketService.onConnect = () => (this.connected = true);

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
