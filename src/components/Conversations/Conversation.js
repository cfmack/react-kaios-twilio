import React from 'react';
import { Link } from "react-router-dom";


export class Conversation extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            conversation: props.conversation,
            messages: [],
            phoneNumbers: [],
            loadingState: 'initializing'
        };
    }

    loadParticipantsFor = (thisConversation) => {
        console.log(thisConversation.sid)
        if (this.state.conversation === thisConversation) {
              thisConversation.getParticipants()
                  .then(participants => {
                      participants.map(p => {
                          let identifier = this.state.sid;
                          if(p.state.attributes.hasOwnProperty('phoneNumber')) {
                              identifier = p.state.attributes.phoneNumber;
                          }

                          if (!this.state.phoneNumbers.includes(identifier)) {
                              let tempNumbers = [...this.state.phoneNumbers];
                              tempNumbers.push(identifier)
                              this.setState( { phoneNumbers: tempNumbers, loadingState: 'ready'})
                          }

                          return true;
                      })
                  })
                .catch(err => {
                    console.error("Couldn't fetch participants IMPLEMENT RETRY", err);
                    this.setState({ loadingState: "failed" });
                });
        }
    };

    componentDidMount = () => {
        if (this.state.conversation) {
            this.loadParticipantsFor(this.state.conversation);
        }
    };

    formatPhoneNumber = function(phoneNumberString) {
        let cleaned = ('' + phoneNumberString).replace(/\D/g, '');
        let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
        if (match) {
            return ['(', match[2], ') ', match[3], '-', match[4]].join('');
        }
        return phoneNumberString;
    };

    renderPhoneNumbers = function(phoneNumbers) {
        let output = '';
        phoneNumbers.map(p => {
            output += this.formatPhoneNumber(p) + ", ";
            return output;
        })

        return (output.trim().slice(0, -1));
    }

    render = () => {
        return (
                <div>
                    <Link to={`/messages/${this.state.conversation.sid}`} >{this.renderPhoneNumbers(this.state.phoneNumbers)}</Link>
                </div>
        )
    };
}