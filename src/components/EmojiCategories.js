import React, { Component, PropTypes } from 'react';
import styles from '../Chat.css';
import {emojify} from 'react-emojione';
import shortnames from 'emoji-shortnames';

const categories = Object.keys(shortnames).map((category, i) =>
  <li className={styles.categoryBtn} key={i}>{emojify(shortnames[category][0])}</li>
);

export default class EmojiCategories extends Component {
  static propTypes = {
    text: PropTypes.string,
    addEmoticon: PropTypes.func
  };
  static defaultProps = {
    text: shortnames['people'].join('')
  };
  state = {
    text: this.props.text
  };
  componentDidMount = () => {
    let firstBtn = document.getElementsByClassName(styles.categoryBtn)[0];
    firstBtn.style.background = '#ffffff';
  };
  setActive = (node) => {
    let children = (node.target.tagName === 'LI') ? node.target.parentNode.childNodes : node.target.parentNode.parentNode.childNodes;
    let child = (node.target.tagName === 'LI') ? node.target : node.target.parentNode;
    for (let i = 0; i < children.length; i++) {
      children[i].style.background = '#D2DCEA';
      if (child === children[i]) {
        this.setState({text: shortnames[Object.keys(shortnames)[i]].join('')});
        child.style.background = '#ffffff';
      }
    }
  };
  addEmoticon = (e) => {
    if (e.target.nodeName === 'SPAN') {
      this.props.addEmoticon(e.target.title);
    }
  };
  render() {
    return (
      <div className={styles.emoticons}>
        <div className={styles.emoticonCategory} onClick={this.addEmoticon}>
          {emojify(this.state.text)}
        </div>
        <ul className={styles.categoryBtns} onClick={this.setActive}>
          {categories}
        </ul>
      </div>
    );
  }
}