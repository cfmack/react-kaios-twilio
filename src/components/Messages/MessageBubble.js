import React, { Component } from "react";
import styles from "./Messages.module.css";


class MessageBubble extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasMedia: this.props.message.type === "media",
            mediaDownloadFailed: false,
            mediaUrl: null
        };
    }

    componentDidMount = async () => {
        this.setState({
            ...this.state,
            type: (await this.props.message.getParticipant()).type
        });
        if (this.state.hasMedia) {
            this.props.message.media
                .getContentTemporaryUrl()
                .then((url) => {
                    this.setState({ mediaUrl: url });
                })
                .catch((e) => this.setState({ mediaDownloadFailed: true }));
        }
        document
            .getElementById(this.props.message.sid)
            .scrollIntoView({ behavior: "smooth" });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        document
            .getElementById(this.props.message.sid)
            .scrollIntoView({ behavior: "smooth" });
    }

    render = () => {
        const { itemStyle, divStyle } =
            this.props.direction === "incoming"
                ? {
                    itemStyle: styles.received_msg,
                    divStyle: styles.received_withd_msg
                }
                : { itemStyle: styles.outgoing_msg, divStyle: styles.sent_msg };

        const m = this.props.message;

        if (this.state.hasMedia) {
            console.log("Message is media message");
            // log media properties
            console.log("Media properties", m.media);
        }
        //console.log(m);
        return (
            <li id={m.sid} className={itemStyle}>
                <div className={divStyle}>
                    <div>
                        <div><strong>
                            {` ${m.author}`}
                        </strong>
                        </div>
                        {m.body}
                    </div>
                    <span className={styles.time_date}>
                        {m.state.timestamp.toLocaleString()}
                    </span>
                </div>
            </li>
        );
    };
}

export default MessageBubble;
