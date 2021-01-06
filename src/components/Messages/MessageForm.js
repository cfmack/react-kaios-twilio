import React, { Component } from 'react';
import MessageBubble from "./MessageBubble";

export class MessageForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            conversation: props.conversation
        };

    }

    handleChange = (event) => {
        event.preventDefault();

        this.setState({
            value: event.target.value
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();

        alert('A name was submitted: ' + this.state.value);
        this.state.conversation.sendMessage(this.state.value)
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Message:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

export default MessageForm;
