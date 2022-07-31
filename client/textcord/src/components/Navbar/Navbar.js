import React, { Fragment } from "react";
import { Button, Tooltip } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import "./Navbar.css";

const Navbar = ({
  signInWithEmailAndPw,
  user,
  setUser,
  setSelectedConversation,
}) => {
  async function logoutHandler() {
    fetch("/logout", {
      credentials: "include",
    });
    setUser({});
    setSelectedConversation({
      id: "",
      name: "",
    });
  }
  return (
    <Fragment>
      <div className="nav">
        <div className="nav-logo">
          <i class="fa-brands fa-rocketchat">
            <span className="nav-logo-span">TEXT~CORD</span>
          </i>
        </div>
        <div className="nav-links">
          <ul className="nav-ul">
            {!user.username && (
              <>
                <li>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      alert("google sign in!");
                    }}
                  >
                    Sign In with Google <i class="fa-brands fa-google"></i>
                  </Button>{" "}
                </li>
                <li>
                  <Button variant="secondary" onClick={signInWithEmailAndPw}>
                    Sign In with Email <i class="fa-solid fa-envelope"></i>
                  </Button>
                </li>
              </>
            )}
            {user.username && (
              <>
                <li>
                  <OverlayTrigger
                    placement={"left"}
                    overlay={
                      <Tooltip id={`tooltip-left`}>
                        Your id: <strong>{user._id}</strong>
                      </Tooltip>
                    }
                  >
                    <Button variant="secondary" onClick={logoutHandler}>
                      Logout<i class="fa-solid fa-right-from-bracket"></i>
                    </Button>
                  </OverlayTrigger>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </Fragment>
  );
};

export default Navbar;
