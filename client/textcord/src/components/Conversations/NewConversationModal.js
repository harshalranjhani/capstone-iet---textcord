import React, { useRef } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const NewContactModal = ({ closeModal }) => {
  const conversationNameRef = useRef();
  const messageRef = useRef();
  const handleSubmit = async (event) => {
    event.preventDefault();
    // createContact()
    const conversationName = conversationNameRef.current.value;
    const message = messageRef.current.value;
    const newConversation = {
      conversationName,
      message,
    };
    try {
      const res = await fetch("/new-conversation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newConversation,
        }),
      });
      const data = await res.json();
      console.log(data);
    } catch (e) {
      console.log(e.message);
    }
  };
  return (
    <div>
      <Modal.Header closeButton>New Conversation</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" ref={conversationNameRef} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Message</Form.Label>
            <Form.Control type="text" ref={messageRef} required />
          </Form.Group>
          <Button variant="secondary" className="m-3" type="submit" onClick={closeModal}>
            Send
          </Button>
        </Form>
      </Modal.Body>
    </div>
  );
};

export default NewContactModal;
