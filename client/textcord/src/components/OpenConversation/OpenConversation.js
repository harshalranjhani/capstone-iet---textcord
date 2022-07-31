import React, { Fragment, useEffect, useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import io from "socket.io-client";

const OpenConversation = ({ user, selectedConversation, contactsSelected }) => {
  const [text, setText] = useState("");
  const [socket, setSocket] = useState(user._id);
  const [conversations, setConversations] = useState([
    {
      receiverId: "",
      messages: [],
    },
  ]);

  useEffect(() => {
    const newSocket = io("http://localhost:5000", { query: { id: user._id } });
    setSocket(newSocket);

    return () => newSocket.close();
  }, [user._id]);

  const addMessageToConversation = () => {
    console.log(selectedConversation);
    if (selectedConversation.id !== "") {
      setConversations((prevConversations) => {
        let madeChange = false;
        const newMessage = { sender: user._id, message: text };
        const newConversations = prevConversations.map((conversation) => {
          if (selectedConversation.id === user._id) {
            madeChange = true;
            return {
              ...conversation,
              messages: [...conversation.messages, newMessage],
            };
          }
          return conversation;
        });
        if (madeChange) {
          return newConversations;
        } else {
          return [
            ...prevConversations,
            { receiverId: selectedConversation.id, messages: [newMessage] },
          ];
        }
      });
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    // socket.emit("send-message", {
    //   receiverId: selectedConversation.id,
    //   message: text,
    // });
    addMessageToConversation();
    console.log(conversations);
  };

  const messageDashboard = (
    <div style={{ display: "flex", flexDirection: "column", flexGrow: "1" }}>
      {!contactsSelected &&
        user.username &&
        user.contacts.length &&
        selectedConversation && (
          <h1
            style={{
              margin: "5px",
              borderBottom: !contactsSelected ? "1px solid black" : "",
            }}
          >
            {selectedConversation.name}
          </h1>
        )}
      {contactsSelected && (
        <p
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i>
            <b>Contact</b> list
          </i>
        </p>
      )}
      <div style={{ display: "flex", flexGrow: "1", overflow: "auto" }}></div>
      <Form onSubmit={sendMessage}>
        <Form.Group>
          <InputGroup>
            <Form.Control
              as="textarea"
              required
              value={text}
              placeholder="Type Here"
              onChange={(e) => setText(e.target.value)}
              style={{
                height: "55px",
                resize: "none",
                margin: "10px",
                border: "1px solid #a3a380",
              }}
            />
            <Button
              type="submit"
              style={{
                height: "55px",
                resize: "none",
                margin: "10px",
                border: "1px solid #a3a380",
              }}
              variant="secondary"
            >
              Send
            </Button>
          </InputGroup>
        </Form.Group>
      </Form>
    </div>
  );

  return <Fragment>{user.username && messageDashboard}</Fragment>;
};

export default OpenConversation;
