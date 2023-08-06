import { Component, OnInit } from '@angular/core';

export interface Message {
  author: string,
  message: string,
  me: boolean
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  messages: Message[] = [];
  username: string | null = null;
  textareaRow: number = 1;

  constructor() { }

  ngOnInit() {
    this.messages = [
      {
        author: "user1",
        message: "Hello world",
        me: false
      },
      {
        author: "user2",
        message: "hi!",
        me: true
      },
      {
        author: "user1",
        message: "teste a long message for exemple, \n break line, and <special> characteres",
        me: false
      }
    ]
    this.username = localStorage.getItem("username");
    this.checkUsername();
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

  updateRows(element: any) {
    let text: string = element?.target?.value;
    if (text)
      this.textareaRow = text.split("\n").length;
    else
      this.textareaRow = 1
  }
  
}
