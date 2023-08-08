import { Component, Input } from '@angular/core';
import { Message } from '../../services/websocket.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html'
})
export class MessageComponent {
  @Input() message!: Message;
}
