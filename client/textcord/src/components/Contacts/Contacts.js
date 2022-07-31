import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";
import styles from "./Contacts.module.css";

const Contacts = ({ user, contacts, setContacts }) => {
  return (
    <div>
      {!user.username && (
        <p className="d-flex justify-content-center mt-5">
          <em>
            <strong>Log In</strong> to add new contacts.
          </em>
        </p>
      )}
      {user.username && (
        <div className={styles.contactParent}>
          <ListGroup variant="flush" style={{ marginTop: "5px" }}>
            <div className={`${`w-[200px]`} ${styles["list-group"]}`}>
              {contacts.map((contact) => (
                <ListGroup.Item key={contact._id}>
                  {contact.name ? contact.name : contact._id}
                </ListGroup.Item>
              ))}
            </div>
          </ListGroup>
        </div>
      )}
    </div>
  );
};

export default Contacts;
