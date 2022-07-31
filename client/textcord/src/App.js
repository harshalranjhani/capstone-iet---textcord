import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Modal } from "react-bootstrap";
import EmailSignInModal from "./components/EmailSignIn/EmailSignInModal.js";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import OpenConversation from "./components/OpenConversation/OpenConversation";

function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState({});
  const [flash, setFlash] = useState(false);
  const [flashMessage, setFlashMessage] = useState("");
  const [selectedConversation, setSelectedConversation] = useState({
    id: "",
    name: "",
  });
  const [contactsSelected, setContactsSelected] = useState(false);

  const signInWithEmailAndPw = () => {
    setModalOpen(true);
  };

  function closeModal() {
    setModalOpen(false);
  }

  function storeLoggedInUser(data) {
    setUser(data);
  }

  return (
    <div className="App">
      <Navbar
        signInWithEmailAndPw={signInWithEmailAndPw}
        user={user}
        setUser={setUser}
        setSelectedConversation={setSelectedConversation}
      />
      <Modal show={modalOpen} onHide={closeModal}>
        <EmailSignInModal
          user={user}
          closeModal={closeModal}
          storeLoggedInUser={storeLoggedInUser}
          flash={flash}
          setFlash={setFlash}
          flashMessage={flashMessage}
          setFlashMessage={setFlashMessage}
        />
      </Modal>
      <div style={{ display: "flex", height: "90vh" }}>
        <Sidebar
          user={user}
          setUser={setUser}
          setSelectedConversation={setSelectedConversation}
          setContactsSelected={setContactsSelected}
        />
        <OpenConversation
          user={user}
          selectedConversation={selectedConversation}
          contactsSelected={contactsSelected}
        />
      </div>
    </div>
  );
}

export default App;
