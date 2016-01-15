import React, { Component, PropTypes } from 'react';
import styles from '../Chat.css';
import TextareaAutosize from 'react-textarea-autosize';
import UserMenu from './UserMenu';
import ToggleDisplay from '../utils/ToggleDisplay';
import emojify from '../utils/emojify';
import EmojiCategories from './EmojiCategories';
import MdKeyboardArrowDown from 'react-icons/lib/md/keyboard-arrow-down';
import MdKeyboardArrowUp from 'react-icons/lib/md/keyboard-arrow-up';

export default class ChatInput extends Component {
  static propTypes = {
    onSend: PropTypes.func,
    submenuShow: PropTypes.bool,
    lng: PropTypes.string,
    onTranslate: PropTypes.func
  };
  state = {
    emoticonShow: false,
    menuShow: false
  };

  hideMenu = (e) => {
    if ((e.target.parentNode.className === styles.btnContainer) ||
      ((e.target.tagName === 'INPUT'))) {
      this.setState({ menuShow: false });
      return;
    }
    this.setState({ menuShow: !this.state.menuShow });
    if (this.state.menuShow === false) {
      let menuTimer = 0;
      const that = this;
      e.currentTarget.addEventListener('mouseleave', function () {
        menuTimer = setTimeout(function () {
          that.setState({ menuShow: false });
        }, 1000);
      });
      e.currentTarget.addEventListener('mouseenter', function () {
        clearTimeout(menuTimer);
      });
    }
  };

  hideEmoticons = (e) => {
    let emoticonBtn = this.emoticonsBtn;
    if (this.state.emoticonShow === false) {
      this.setState({ emoticonShow: !this.state.emoticonShow });
      let menuTimer = 0;
      const that = this;
      emoticonBtn.style.transform = 'rotate(180deg)';
      e.currentTarget.addEventListener('mouseleave', function () {
        menuTimer = setTimeout(function () {
          emoticonBtn.style.transform = 'rotate(0deg)';
          that.setState({ emoticonShow: false });
        }, 1000);
      });
      e.currentTarget.addEventListener('mouseenter', function () {
        clearTimeout(menuTimer);
      });
    } else if ((e.target.parentNode.className !== styles.categoryBtns) &&
      (e.target.parentNode.className !== styles.categoryBtn)) {
      this.setState({ emoticonShow: !this.state.emoticonShow });
      emoticonBtn.style.transform = 'rotate(0deg)';
    }
  };

  addTranslation = (e) => {
    this.addStr(e);
    this.setState({ menuShow: false });
  };
  addStr = (e) => {
    let node = this.usermsg;
    node.value = node.value + e + ' ';
    node.focus();
  };

  btnHovered = (e) => {
    e.currentTarget.querySelectorAll('span')[2].removeAttribute('title');
  };

  render() {
    const onSend = this.props.onSend;
    return (<div className={styles.chatInpContainer}>
        <div className={styles.chatOptions} onClick={this.hideMenu}>
          <ToggleDisplay show={!this.state.menuShow}>
            <MdKeyboardArrowDown className={styles.arrowDown} />
          </ToggleDisplay>
          <ToggleDisplay show={this.state.menuShow}>
            <MdKeyboardArrowUp className={styles.arrowUp} />
          </ToggleDisplay>
          <UserMenu
            menuShow={this.state.menuShow}
            submenuShow={this.props.submenuShow}
            addTranslation={this.addTranslation}
            onSend={this.props.onSend}
            lng={this.props.lng}
            onTranslate={this.props.onTranslate}
          />
        </div>
        <TextareaAutosize
          ref={(ref) => this.usermsg = ref} className={styles.usermsg} autoFocus onKeyPress={
            (e) => {
              if (e.nativeEvent.keyCode !== 13 || e.shiftKey) return;
              e.preventDefault();
              const input = e.target;
              let txt = input.value;
              txt = txt.trim();
              if ((txt === '') || (txt === ' ') || (txt === '\n')) {
                this.usermsg._rootDOMNode.style.height = '26px';
                this.usermsg.value = '';
                return;
              }
              onSend({ txt }, function success() {
                input.value = '';
              });
            }
          }
        />
        <div className={styles.emoticonsContainer} onClick={this.hideEmoticons}>
          <div
            ref={(ref) => this.emoticonsBtn = ref}
            className={styles.emoticonsBtn}
            onMouseOver={this.btnHovered}
          >
            {emojify(' :) ')}
          </div>
          <ToggleDisplay show={this.state.emoticonShow}>
            <EmojiCategories addEmoticon={this.addStr} />
          </ToggleDisplay>
        </div>
      </div>
    );
  }
}
