import React, { Component, PropTypes } from 'react';
import styles from '../Chat.css';
import Messages from './Message';

export default class ChatArea extends Component {
  static propTypes = {
    messages: PropTypes.array,
    replay: PropTypes.func,
    isMine: PropTypes.func,
    onTranslate: PropTypes.func,
    onDelete: PropTypes.func,
    translateLanguages: PropTypes.array,
    lang: PropTypes.string
  };

  state = {
    voiceName: ''
  };

  componentWillMount() {
    const that = this;
    window.speechSynthesis.onvoiceschanged = function (e) {
      const voices = window.speechSynthesis.getVoices();
      let voicesByLang = [];
      for (let i = 0; i < voices.length; i++) {
        let option = voices[i];
        if (option.lang.indexOf(that.props.lang) > -1) voicesByLang.push(option);
      }
      if (voicesByLang.length !== 0) {
        that.setState({ voiceName: voicesByLang[0].name });
      }
    };
  }
  componentDidMount() {
    setTimeout(this.updateScrollTop, 500);
  }
  componentDidUpdate = () => {
    const msg = this.messages.message.childNodes[1];
    if (msg && msg.style.backgroundImage === 'url("//cdnjs.cloudflare.com/ajax/libs/emojione/1.5.2/assets/sprites/emojione.sprites.png")') { // eslint-disable-line max-len
      msg.style.fontSize = '34px';
    }
    this.updateScrollTop();
  };
  updateScrollTop = () => {
    let node = document.getElementById('container');
    if (!node) {
      return;
    }
    node.scrollTop = node.scrollHeight;
  };

  render() {
    const {
      messages,
      replay,
      isMine,
      onTranslate,
      onDelete,
      translateLanguages,
      lang
    } = this.props;
    return (
      <div id="container" className={styles.container}>
        {
          messages.map(message => {
            return (
              <Messages key={message.id}
                message={message}
                replay={replay}
                isMine={isMine}
                onTranslate={onTranslate}
                onDelete={onDelete}
                translateLanguages={translateLanguages}
                lang={lang}
                voiceName={this.state.voiceName}
                ref={(ref) => this.messages = ref}
              />
            );
          })
        }
      </div>
    );
  }
}
