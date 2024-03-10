import React from "react";
import Navbar from "react-bootstrap/Navbar";
import'../styles/footer.css'

import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";

export const PageLayout = (props) => {
  const isAuthenticated = useIsAuthenticated();

  return (
    <>
      <Navbar style={{ backgroundColor: '#F2F2F2' }} variant="dark" className="navbarStyle">
        <a className="navbar-brand" href="/">
          <img
            src="/res/logo1.png"
            alt=""
            height="60"
            className="d-inline-block align-top"
          />
        </a>
        <div className="collapse navbar-collapse justify-content-end">
          {isAuthenticated ? <SignOutButton /> : <SignInButton />}
        </div>
      </Navbar>
      {props.children}

      <footer style={{ backgroundColor: '#F2F2F2' }} variant="dark" className="navbarStyle">
        Bow Valley College - Software Development Diploma Project. Developed By{' '}
        <ul>
          <li>
            <a href="https://github.com/JhenyfferCristo" target="_blank" rel="noopener noreferrer">
             Jhenyffer
            </a>
          </li>
          <li>
            <a href="https://github.com/JeonJiw" target="_blank" rel="noopener noreferrer">
              Jiwon
            </a>
          </li>
          <li>
            <a href="https://github.com/vergilht" target="_blank" rel="noopener noreferrer">
              Vergil
            </a>
          </li>
          <li>
            <a href="https://github.com/Chris-J-Thib" target="_blank" rel="noopener noreferrer">
              Chris
            </a>
          </li>
        </ul>
      </footer>
    </>
    
  );
};
