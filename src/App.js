import React, { useState } from "react";
import { Header, Input, Conversations, Softkey } from "./components";
import { useNavigation } from "./hooks";

export default function App() {
  const [conversations, setConversation] = useState([]);

  const [current, setNavigation] = useNavigation();

  const onKeyCenter = () => {
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

  const onKeyRight = () => {
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

  return (
    <>
      <Header title="Conversations" />

      <Input type="text" label="New Conversation" />
      <Conversations conversations={conversations} />

      <Softkey
        center={current.type === "INPUT" ? "Insert" : "Toggle"}
        onKeyCenter={onKeyCenter}
        right={current.type === "SPAN" ? "Delete" : ""}
        onKeyRight={onKeyRight}
      />
    </>
  );
}
