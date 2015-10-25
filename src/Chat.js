import React, { Component, PropTypes } from 'react';
import Avatar from './Avatar';
import styles from './Chat.css';

class MsgBox extends Component {
    render() {
        return(
            <div key={this.props.msg} className={styles.u_msg}>
                <div className={styles.content_msg}> {this.props.msg} </div>
                <div className={styles.footer_msg}>
                    {
                        <div>
                            <div style={{float: 'left'}}> {this.props.name} </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

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
              <Avatar
                      src={message.avatar}
                      name={message.name}
                  />
                <div className={styles.arrowLeft}></div>
                <MsgBox msg={ message.msg} name={message.name} time={message.time} sender={message.sender} />
            </div>
          })
        }
        </div>
    );
  }

}
