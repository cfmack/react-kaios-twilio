import React, { Component } from 'react';
import {Conversation} from "../Conversations/Conversation";

export class Messages extends Component {
    constructor(props) {
        super(props);
        this.selectedConversationSid = this.props.match.params.conversationSid;
        this.state = {
            messages: [],
            conversation: null
        };

        this.filterConversation = this.filterConversation.bind(this);
        this.loadMessagesFor = this.loadMessagesFor.bind(this);

        this.filterConversation(this.selectedConversationSid, this.props.conversations)
    }

    filterConversation = (selectedConversationSid, conversations) => {
        conversations.map((conversation) => {
            if ( conversation.sid === selectedConversationSid ) {
                this.state.conversation = conversation;
            }
        })
    }

    loadMessagesFor = (thisConversation) => {
        console.log(thisConversation.sid)
        if (this.state.conversation === thisConversation) {
            thisConversation.getMessages()
                .then(paginator => {
                    paginator.items.map(m => {
                       this.state.messages.push(m);
                       this.setState( { messages: this.state.messages })
                       return true;
                    })
                })
                .catch(err => {
                    console.error("Couldn't fetch messages IMPLEMENT RETRY", err);
                });
        }
    };

    componentDidMount = () => {
        if (this.state.conversation) {
            this.loadMessagesFor(this.state.conversation);
        }
    };

    renderMessages = function(messages) {
        let output = [];
        messages.map(m => {
            output.push(<p>{m.state.body}</p>);
            return output;
        })

        return output;
    }

    render() {
        return (
            <div>
                <h3>Id : {this.selectedConversationSid}</h3>
                {this.renderMessages(this.state.messages)}
            </div>
        );
    }
}
