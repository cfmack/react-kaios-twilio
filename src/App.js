import React from "react";
import {Header, TwilioClient} from "./components";
//import { useNavigation } from "./hooks";
import { Routes } from "./Routes";
import {Client as ConversationsClient} from "@twilio/conversations";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    //const [current, setNavigation] = useNavigation();

    const name = localStorage.getItem("name");
    const loggedIn = name !== "";
    this.state = {
      name,
      loggedIn,
      token: null,
      statusString: null,
      conversationsReady: false,
      conversations: [],
      selectedConversationSid: null,
      newMessage: ""
    };

    this.conversationsClient = null;
  }

  componentDidMount = () => {
    if (this.state.loggedIn) {
      this.getToken();
      this.setState({ statusString: "Fetching credentials…" });
    }
  };

  logIn = (name) => {
    if (name !== "") {
      localStorage.setItem("name", name);
      this.setState({ name, loggedIn: true }, this.getToken);
    }
  };

  getToken = () => {
    // Paste your unique Chat token function
    if (this.state.token == null) {
      const auth = new TwilioClient();
      const myToken = auth.generateToken();
      this.setState({ token: myToken }, this.initConversations);
    }
  };

  initConversations = async () => {
    window.conversationsClient = ConversationsClient;
    this.conversationsClient = await ConversationsClient.create(this.state.token);
    this.setState({ statusString: "Connecting to Twilio…" });

    this.conversationsClient.on("connectionStateChanged", (state) => {
      if (state === "connecting")
        this.setState({
          statusString: "Connecting to Twilio…",
          status: "default"
        });
      if (state === "connected") {
        this.setState({
          statusString: "You are connected.",
          status: "success"
        });
      }
      if (state === "disconnecting")
        this.setState({
          statusString: "Disconnecting from Twilio…",
          conversationsReady: false,
          status: "default"
        });
      if (state === "disconnected")
        this.setState({
          statusString: "Disconnected.",
          conversationsReady: false,
          status: "warning"
        });
      if (state === "denied")
        this.setState({
          statusString: "Failed to connect.",
          conversationsReady: false,
          status: "error"
        });
    });
    this.conversationsClient.on("conversationJoined", (conversation) => {
      this.setState({ conversations: [...this.state.conversations, conversation] });
    });
    this.conversationsClient.on("conversationLeft", (thisConversation) => {
      this.setState({
        conversations: [...this.state.conversations.filter((it) => it !== thisConversation)]
      });
    });
  };

  /*
    onKeyCenter = () => {
      const currentElement = document.querySelector("[nav-selected=true]");
      const currentNavigationIndex = parseInt(currentElement.getAttribute("nav-index"), 10);

      const isATask = currentNavigationIndex > 0;
      if (isATask) {
        setConversation(prevState => {
          const current = [...prevState];
          current[currentNavigationIndex - 1].completed = !current[currentNavigationIndex - 1].completed;
          return current;
        });
      } else if (currentElement.value.length) {
        const conversation = { name: currentElement.value, completed: false };
        setConversation(prevState => [...prevState, conversation]);
        currentElement.value = "";
      }
    };

    onKeyRight = () => {
      const currentIndex = parseInt(
        document.querySelector("[nav-selected=true]").getAttribute("nav-index"),
        10
      );
      if (currentIndex > 0) {
        setConversation(prevState => {
          const current = [...prevState];
          current.splice(currentIndex - 1, 1);
          const goToPreviousElement = Boolean(current.length);
          setNavigation(goToPreviousElement ? currentIndex - 1 : 0);
          return current;
        });
      }
    };
            <Softkey
                center={current.type === "INPUT" ? "Insert" : "Toggle"}
                onKeyCenter={onKeyCenter}
                right={current.type === "SPAN" ? "Delete" : ""}
                onKeyRight={onKeyRight}
            />

  */
  render = () => {
    const { conversations, loggedIn } = this.state;

    if (loggedIn === false) {
      this.logIn(process.env.REACT_APP_TWILIO_DEFAULT_IDENTITY);
    }

    return (
        <>
          <Header title="Conversations"/>
          <Routes
              conversations={conversations}
          />
        </>
    );
  }
}
