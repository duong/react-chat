import React, { Component, PropTypes } from 'react';
import Avatar from './Avatar';
import styles from './Style.css';

export default class Chat extends Component {
  static defaultProps = {
    messages: []
  };

  static propTypes = {
    messages: PropTypes.array
  };

  /*constructor(props) {
    super(props);
  }*/

  render() {
    return (
        <div className={styles.base}>{
          this.props.messages.map( message => {
            return <div key={message.id} className={styles.msgBox}>
              <Avatar className={styles.avatar}
                      src={message.avatar}
                      name={message.name}
                  />
            </div>
          })
        }
        </div>
    );
  }

}
