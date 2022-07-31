import React, { useRef, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const NewContactModal = ({ closeModal, user,setContacts }) => {
  const idRef = useRef();
  const nameRef = useRef();
  const emailRef = useRef();

  const fetchContacts = async (userId) => {
    const res = await fetch(`/list-contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: user._id,
      }),
    });
    if (!res.ok) {
      console.log("error");
    }
    const data = await res.json();
    console.log("Contacts:");
    console.log(data);
    setContacts(data);
  };

  const createContact = async (userId) => {
    const id = idRef.current.value;
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const newContact = {
      name,
      email,
    };
    try {
      // console.log(newContact);
      const res = await fetch(`/user/${userId}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newContact,
        }),
      });
      // console.log(res.status);
      const data = await res.json();
      console.log(data);

      if (res.status === 401) {
        return;
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    createContact(user._id);
  };
  return (
    <div>
      <Modal.Header closeButton>Create New Contact</Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Id</Form.Label>
            <Form.Control type="text" ref={idRef} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" ref={nameRef} required />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" ref={emailRef} required />
          </Form.Group>
          <Button
            variant="secondary"
            className="m-3"
            type="submit"
            onClick={closeModal}
          >
            Add
          </Button>
        </Form>
      </Modal.Body>
    </div>
  );
};

export default NewContactModal;
