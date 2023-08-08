import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-username-form',
  templateUrl: './username-form.component.html'
})
export class UsernameFormComponent implements OnInit {
  username: string | null = null;

  ngOnInit(): void {
    this.username = localStorage.getItem("username");
  }

  saveUsername() {
    let element:any = document.getElementById("usernameInput");
    this.username = element?.value;
    if (this.username != null)
      localStorage.setItem("username", this.username); 
  }
}
