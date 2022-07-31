import React, { useRef, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import FlashMessage from "react-flash-message";

const EmailSignInModal = ({
  user,
  closeModal,
  storeLoggedInUser,
  flash,
  setFlash,
  flashMessage,
  setFlashMessage,
}) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();

  const [login, setLogin] = useState(false);
  const [registerFlash, setRegisterFlash] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // createContact()
    const userUsername = usernameRef.current.value;
    const userEmail = emailRef.current.value;
    const userPassword = passwordRef.current.value;
    const userData = {
      email: userEmail,
      password: userPassword,
      username: userUsername,
    };
    try {
      // console.log(userData);
      const res = await fetch("/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userData,
        }),
      });
      // console.log(res.status);
      const data = await res.json();
      console.log(data);

      if (res.status === 401) {
        setFlash(true);
        setRegisterFlash(true);
        setFlashMessage(
          "A user with that username or email already already exists."
        );
        return;
      } else {
        setLogin(true);
        closeModal();
      }
    } catch (e) {
      console.log(e.message);
      setFlash(true);
      setFlashMessage(e.message);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setFlash(false);
    const userUsername = usernameRef.current.value;
    const userPassword = passwordRef.current.value;
    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userUsername,
          password: userPassword,
        }),
        credentials: "include",
      });

      if (res.status === 401) {
        setFlashMessage("Incorrect username or password!");
        setFlash(true);
        return;
      }
      const data = await res.json();
      // setUser(data);
      // console.log(user)
      closeModal();
      storeLoggedInUser(data);
    } catch (e) {
      console.log(e.message);
      setFlash(true);
      setFlashMessage(e.message);
    }
    setFlash(false);
  };

  if (!login) {
    return (
      <div>
        <Modal.Header closeButton>Sign Up!</Modal.Header>
        {flash && registerFlash && (
          <FlashMessage duration={2000}>
            <div class="alert alert-danger" role="alert">
              {flashMessage}
            </div>
          </FlashMessage>
        )}
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                ref={usernameRef}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                ref={passwordRef}
                required
              />
            </Form.Group>
            <Button
              variant="secondary"
              className="m-3"
              type="submit"
              onClick={() => {
                closeModal();
              }}
            >
              Register
            </Button>
            <Button
              variant="secondary"
              className="m-3"
              type="button"
              onClick={() => {
                setLogin((value) => !value);
              }}
            >
              Login Instead?
            </Button>
          </Form>
        </Modal.Body>
      </div>
    );
  } else {
    return (
      <div>
        <Modal.Header closeButton>Log In!</Modal.Header>
        {flash && (
          <FlashMessage duration={2000}>
            <div class="alert alert-danger" role="alert">
              {flashMessage}
            </div>
          </FlashMessage>
        )}
        <Modal.Body>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                id="username"
                ref={usernameRef}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                id="password"
                ref={passwordRef}
                required
              />
            </Form.Group>
            <Button variant="secondary" className="m-3" type="submit">
              Login
            </Button>
          </Form>
        </Modal.Body>
      </div>
    );
  }
};

export default EmailSignInModal;
