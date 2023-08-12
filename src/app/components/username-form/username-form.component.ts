import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-username-form',
  templateUrl: './username-form.component.html'
})
export class UsernameFormComponent {
  public formGroup: FormGroup;
  public username: string | null = null;

  constructor() {
    this.username = localStorage.getItem("username");
    this.formGroup = new FormGroup({
      username: new FormControl(this.username, [Validators.required])
    });
  }

  onSubmit() {
    if (this.formGroup.invalid)
      return;
    this.username = this.formGroup.value.username;
    if (this.username != null)
      localStorage.setItem("username", this.username); 
  }
}
