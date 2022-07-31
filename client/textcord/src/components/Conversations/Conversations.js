import React, { useState } from "react";
import { ListGroup } from "react-bootstrap";
import styles from "../Contacts/Contacts.module.css";

const Conversations = ({ user, contacts, setSelectedConversation }) => {
  return (
    <div>
      {!user.username && (
        <p className="d-flex justify-content-center mt-5">
          <em>
            <strong>Log In</strong> to make a conversation.
          </em>
        </p>
      )}
      {user.username && (
        <div className={styles.conversationParent}>
          <ListGroup variant="flush" style={{ marginTop: "5px" }}>
            <div className={`${`w-[200px]`} ${styles["list-group"]}`}>
              {contacts.map((contact) => (
                <div
                  key={contact._id}
                  onClick={() => {
                    setSelectedConversation({
                      id: contact._id,
                      name: contact.name,
                    });
                  }}
                >
                  <ListGroup.Item className={styles.onHover}>
                    {contact.name ? contact.name : contact._id}
                  </ListGroup.Item>
                </div>
              ))}
            </div>
          </ListGroup>
        </div>
      )}
    </div>
  );
};

export default Conversations;
