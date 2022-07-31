import React, { useState } from "react";
import { Tab, Nav } from "react-bootstrap";
import "./Sidebar.css";
import Conversations from "../Conversations/Conversations";
import Contacts from "../Contacts/Contacts";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Tooltip, Button, Modal } from "react-bootstrap";
import NewContactModal from "../Contacts/NewContactModal";
import NewConversationModal from "../Conversations/NewConversationModal";

const CONVERSATIONS_KEY = "conversations";
const CONTACTS_KEY = "contacts";

const Sidebar = ({
  user,
  selectedConversation,
  setSelectedConversation,
  setContactsSelected,
}) => {
  const [activeTab, setActiveTab] = useState(CONVERSATIONS_KEY);
  const [copied, setCopied] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [contacts, setContacts] = useState([]);
  const closeModal = () => {
    setOpenModal(false);
  };

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
    console.log(data);
    setContacts(data);
  };

  const newContactClick = () => {
    setOpenModal(true);
    fetchContacts(user._id);
  };

  const newConversationClick = () => {
    setOpenModal(true);
  };

  function copyId(user) {
    navigator.clipboard.writeText(user._id);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  return (
    <div className="d-flex sidebar" style={{ height: "90vh", width: "250px" }}>
      <div
        style={{ width: "250px" }}
        className="d-flex flex-column my-1 overflow-scroll"
      >
        <Tab.Container
          style={{ width: "250px", height: "400px" }}
          activeKey={activeTab}
          onSelect={setActiveTab}
        >
          <Nav
            variant="tabs"
            className="justify-content-start"
            style={{ width: "250px" }}
          >
            <Nav.Item className="nav-item">
              <Nav.Link
                eventKey={CONVERSATIONS_KEY}
                onClick={() => setContactsSelected(false)}
              >
                Conversations
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="nav-item">
              <Nav.Link
                eventKey={CONTACTS_KEY}
                onClick={() => setContactsSelected(true)}
              >
                Contacts
              </Nav.Link>
            </Nav.Item>
          </Nav>
          {user.username && (
            <div className="d-flex mt-1 justify-content-center">
              <Button
                className="rounded-0"
                variant="secondary"
                onClick={
                  activeTab === CONVERSATIONS_KEY
                    ? newConversationClick
                    : newContactClick
                }
              >
                New{" "}
                {activeTab === CONVERSATIONS_KEY ? "Conversation" : "Contact"}
              </Button>
            </div>
          )}
          <Tab.Content>
            <Tab.Pane eventKey={CONVERSATIONS_KEY}>
              <Conversations
                user={user}
                contacts={contacts}
                setSelectedConversation={setSelectedConversation}
              />
            </Tab.Pane>
            <Tab.Pane eventKey={CONTACTS_KEY}>
              <Contacts user={user} contacts={contacts} />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        {user.username && (
          <div className="text-muted p-2 border-top border-right mt-auto">
            Your id:
            <OverlayTrigger
              placement={"top"}
              overlay={
                <Tooltip id={`tooltip-top`}>
                  {!copied ? "Copy to clipboard" : "Copied!"}
                </Tooltip>
              }
            >
              <button className="btn" onClick={copyId.bind(null, user)}>
                <i class="fa-solid fa-copy"></i>
              </button>
            </OverlayTrigger>
            <strong style={{ fontSize: "small" }}>{user._id}</strong>
          </div>
        )}
      </div>
      <Modal show={openModal} onHide={closeModal}>
        {activeTab === CONVERSATIONS_KEY ? (
          <NewConversationModal closeModal={closeModal} user={user} />
        ) : (
          <NewContactModal
            closeModal={closeModal}
            user={user}
            fetchContacts={fetchContacts}
          />
        )}
      </Modal>
    </div>
  );
};

export default Sidebar;
