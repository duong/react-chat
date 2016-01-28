import React, { Component, PropTypes } from 'react';
import styles from '../Chat.css';
import testLanguages from '../utils/testLanguages';

export default class ChatInput extends Component {
  componentDidMount() {
    for (let i = 0, l = testLanguages.length; i < l; i++) {
      let option = testLanguages[i];
      this.languageSelect.options.add(new Option(option.l, option.c));
      if (option.selected) this.languageSelect.value = this.languageSelect.options[i].value;
    }
  }
  render() {
    return (
      <select ref={(ref) => this.languageSelect = ref}/>
    );
  }
}