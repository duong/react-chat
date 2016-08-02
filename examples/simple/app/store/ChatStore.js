import { observable, action } from 'mobx';
import testMessages from '../testMessages';

export default class ChatStore {
  @observable messages = testMessages;

  @action send = (msg, success) => {
    const message = {
      id: (Date.now() / 1000 | 0),
      name: this.me.name,
      avatar: this.me.avatar,
      msg: msg.txt,
      time: Date.now() / 1000 | 0,
      sender: '1'
    };

    this.messages.push(message);
    success();
  };

  @action remove = (message, success) => {
    // Add here delete method
    success();
  };
}

