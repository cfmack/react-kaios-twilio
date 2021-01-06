import React, { Component } from 'react';
import MessageBubble from "./MessageBubble";
import MessageForm from "./MessageForm";

export class Messages extends Component {
    constructor(props) {
        super(props);
        this.selectedConversationSid = this.props.match.params.conversationSid;
        this.state = {
            messages: [],
            value: '',
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
            if (m.author === process.env.REACT_APP_TWILIO_DEFAULT_IDENTITY)
            {
                output.push(
                    <MessageBubble key={m.index} direction="outgoing" message={m} />
                );
            }
            else {
                output.push(<MessageBubble key={m.index} direction="incoming" message={m} />);
            }
            return output;
        })

        return output;
    }

    render() {
        return (
            <div>
                <ul id="message_list">{this.renderMessages(this.state.messages)}</ul>
                <MessageForm conversation={this.state.conversation}/>
            </div>
        );
    }
}
