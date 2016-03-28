import React, { Component, PropTypes } from 'react';
import styles from '../chat.scss';
import convertMedia from '../utils/convertMedia';
import MdMic from 'react-icons/lib/md/mic';
import MdMessage from 'react-icons/lib/md/message';
import MdOndemandVideo from 'react-icons/lib/md/ondemand-video';
import MdImage from 'react-icons/lib/md/image';
import MdClose from 'react-icons/lib/md/close';

export default class UserMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      micShow: false,
      submenuShow: false
    };
  }
  componentWillMount() {
    this.SpeechRecognition = window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      window.mozSpeechRecognition ||
      window.msSpeechRecognition ||
      window.oSpeechRecognition;
  }
  componentDidMount() {
    if (!this.SpeechRecognition &&
      (!this.props.onTranslate ||
      !this.props.translateLanguages)) {
      this.optsCount = '-60px';
    } else if (!this.SpeechRecognition ||
      !this.props.onTranslate ||
      !this.props.translateLanguages) {
      this.optsCount = '-90px';
    } else this.optsCount = '-121px';
  }

  mapRefVideo = (node) => {
    this.videoInp = node;
  };
  mapRefTranslate = (node) => {
    this.translateInp = node;
  };
  mapRefImage = (node) => {
    this.imgInp = node;
  };
  mapRefContainer = (node) => {
    this.videoInpContainer = node;
  };

  changeVideoInp = (e) => {
    let media = convertMedia(e.target.value, 150, true);
    let videoContainer = this.videoInpContainer;
    let mediaContainer = document.createElement('span');

    mediaContainer.innerHTML = media;
    if (videoContainer.children.length === 3) videoContainer.appendChild(mediaContainer);
    else videoContainer.replaceChild(mediaContainer, videoContainer.children[3]);


    if (e.nativeEvent.keyCode === 13) {
      const txt = e.target.value;
      if ((txt === '') || (txt === ' ')) return;
      this.props.onSend({ txt }, () => {
        this.handleClose(e);
      });
    } else if (e.nativeEvent.keyCode === 27) {
      this.handleClose(e);
    }
  };

  insertTranslation = (e) => {
    if (e.nativeEvent.keyCode === 13) {
      this.props.onTranslate(
        e.target.value,
        this.props.lang,
        txt => {
          this.props.addTranslation(txt);
          this.handleClose();
        }
      );
    } else if (e.nativeEvent.keyCode === 27) {
      this.handleClose(e);
    }
  };

  handleClick = (opt, e) => {
    switch (opt) {
      case 0: {
        this.setState({ micShow: true });
        const SpeechRecognition = this.SpeechRecognition;
        if (SpeechRecognition) {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = true;
          this.recognition.interimResults = true;
          this.recognition.lang = this.props.lang;
          this.recognition.start();
          this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
              } else {
                interimTranscript += event.results[i][0].transcript;
              }
            }
            if (finalTranscript !== '') this.props.addTranslation(finalTranscript);
          };
          this.recognition.onerror = () => {
            this.hideIndicator(e);
          };
          this.recognition.onend = () => {
            this.hideIndicator();
          };
        }
        break;
      }
      case 1: {
        this.setState({ submenuShow: true });
        setTimeout(() => {
          this.translateInp.focus();
        }, 0);
        this.translateInp.style.zIndex = 1;
        break;
      }
      case 2: {
        this.setState({ submenuShow: true });
        setTimeout(() => {
          this.videoInp.focus();
        }, 0);
        this.videoInp.style.zIndex = 1;
        break;
      }
      case 3: {
        this.setState({ submenuShow: true });
        setTimeout(() => {
          this.imgInp.focus();
        }, 0);
        this.imgInp.style.zIndex = 1;
        break;
      }
      default:
    }
  };
  hideIndicator = () => {
    this.recognition.stop();
    this.setState({ micShow: false });
  };
  handleClose = () => {
    this.submenuShow = false;
    this.setState({ submenuShow: false });
    this.videoInp.value = '';
    this.translateInp.value = '';
    this.imgInp.value = '';
    if (this.videoInpContainer.childNodes.length > 3) {
      this.videoInpContainer.removeChild(this.videoInpContainer.childNodes[3]);
    }
    this.translateInp.style.zIndex = 0;
    this.videoInp.style.zIndex = 0;
    this.imgInp.style.zIndex = 0;
  };

  render() {
    const { menuShow, onTranslate, translateLanguages } = this.props;
    return (<div className={styles.userContainer}>
        <ul
          style={{ marginTop: this.optsCount }}
          className={menuShow ? styles.showUmenu : styles.hideUmenu}
        >
          {
            this.SpeechRecognition ?
            <li onClick={this.handleClick.bind(this, 0)}>
              <MdMic /><a href="#">Dictate text</a>
            </li> : null
          }
          {
            (onTranslate && translateLanguages) ?
            <li className={styles.liTranslate} onClick={this.handleClick.bind(this, 1)}>
              <MdMessage /><a href="#">Translate a phrase</a>
            </li> : null
          }
          <li className={styles.liVideo} onClick={this.handleClick.bind(this, 2)}>
            <MdOndemandVideo /><a href="#">Insert video</a>
          </li>
          <li className={styles.liImage} onClick={this.handleClick.bind(this, 3)}>
            <MdImage /><a href="#">Insert image</a>
          </li>
        </ul>
        {
          (this.state.submenuShow) ?
           <div>
             <div ref={this.mapRefContainer} className={styles.videoInpContainer}>
               <input
                 ref={this.mapRefVideo}
                 placeholder="Video url (youtube, vimeo)"
                 onKeyUp={this.changeVideoInp}
                 style={{ position: 'relative' }}
               />
               <input
                 ref={this.mapRefTranslate}
                 placeholder="Tape a phrase to be translated"
                 onKeyUp={this.insertTranslation}
                 style={{ position: 'absolute', top: '15px', width: '88%' }}
               />
               <input
                 ref={this.mapRefImage}
                 placeholder="Image url"
                 onKeyUp={this.changeVideoInp}
                 style={{ position: 'absolute', top: '15px', width: '88%' }}
               />
             </div>
             <div className={styles.btnContainer}
               onClick={this.handleClose}
             >
               <MdClose className={styles.iconClear} />
             </div>
           </div> : null
        }
        {
          (this.state.micShow) ?
           <div className={styles.micShow}>
             <MdMic className={styles.iconMic} onClick={this.hideIndicator} />
           </div> : null
        }
      </div>
    );
  }
}
UserMenu.propTypes = {
  menuShow: PropTypes.bool,
  onSend: PropTypes.func,
  addTranslation: PropTypes.func,
  lang: PropTypes.string,
  onTranslate: PropTypes.func,
  translateLanguages: PropTypes.array
};
UserMenu.defaultProps = {
  lang: 'en'
};