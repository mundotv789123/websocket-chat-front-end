import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message, WebsocketService } from './services/websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  connected:boolean = false;
  messages: Message[] = [];
  username: string | null = null;
  textareaRow: number = 1;

  private websocketService: WebsocketService;

  formGroup: FormGroup = new FormGroup({
    message: new FormControl('', [Validators.required])
  });

  constructor(websocketService:WebsocketService) { this.websocketService = websocketService }

  ngOnInit() {
    this.username = localStorage.getItem("username");
    this.checkUsername();

    this.websocketService.onMessage = (message: Message) => {
      message.me = message.author == this.username;
      this.messages.push(message)
    };
    this.websocketService.onConnect = () => (this.connected = true);

    this.websocketService.openConnection();
  }

  saveUsername() {
    let element:any = document.getElementById("usernameInput");
    this.username = element?.value;
    if (this.username != null)
      localStorage.setItem("username", this.username); 
  }

  checkUsername(): boolean {
    if (this.username == null || this.username == "") {
      let usernameButtom: any = document.getElementById("usernameButton");
      usernameButtom.click();
      return false;
    }
    return true;
  }

  updateRows() {
    let text: string = this.formGroup.controls['message'].value;
    this.textareaRow = text ? text.split("\n").length : 1;
  }
 
  sendMessage() {
    if (!this.username || !this.checkUsername() || !this.formGroup.valid)
      return

    let message = this.formGroup.controls['message'].value
    this.websocketService.sendMessage({author: this.username, message: message});

    this.formGroup.controls['message'].reset();
    this.updateRows();
  }
}
