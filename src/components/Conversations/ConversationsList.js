import React from 'react';
import { Conversation } from "./Conversation";


export class ConversationsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            conversations: []
        };
    }

    render() {
        const { conversations } = this.props;

        return (
            <>{
                conversations.map((conversation) => {
                    return (
                        <Conversation key={conversation.sid}
                            conversation={conversation}
                        />)
                })
            }
            </>
        )
    }
}
