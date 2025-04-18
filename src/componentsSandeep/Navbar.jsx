import React, { useState } from "react";
import styled from "styled-components";
import { auth, provider } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  setActiveUser,
  setUserLogOutState,
  selectUserName,
  selectUserEmail,
} from "../userSlice";
import { FiMenu, FiX } from "react-icons/fi";

// Styled Components
const Nav = styled.nav`
  width: 100%;
  background: white;
  padding: 15px 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  z-index: 100;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
`;

const Logo = styled.img`
  height: 31px;
  width: 186px;
`;

const MenuToggle = styled.div`
  display: none;
  font-size: 28px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Menu = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    background: white;
    padding: ${({ isOpen }) => (isOpen ? "20px" : "0")};
    max-height: ${({ isOpen }) => (isOpen ? "500px" : "0")};
    overflow: hidden;
    transition: max-height 0.3s ease;
    box-shadow: ${({ isOpen }) =>
      isOpen ? "0 4px 6px rgba(0,0,0,0.1)" : "none"};
  }
`;

const NavList = styled.ul`
  list-style: none;
  display: flex;
  gap: 30px;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    width: 100%;
  }
`;

const Anchor = styled.a`
  color: #8292b4;
  text-decoration: none;
  font-family: sans-serif;

  &:hover {
    color: #457eff;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const Button = styled.button`
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 40px;
  color: #457eff;
  background: white;
  border: 1px solid #457eff;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const RegisterButton = styled(Button)`
  background: #ff7555;
  color: white;
  border: none;
`;

export default function Navbar() {
  const dispatch = useDispatch();
  const userName = useSelector(selectUserName);
  const userEmail = useSelector(selectUserEmail);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignIn = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch(
          setActiveUser({
            userName: result.user.displayName,
            userEmail: result.user.email,
          })
        );
      })
      .catch((err) => console.log(err));
  };

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => dispatch(setUserLogOutState()))
      .catch((err) => alert(err.message));
  };

  return (
    <Nav>
      <Container>
        <a href="https://www.naukri.com" target="_blank" rel="noopener noreferrer">
          <Logo src="https://static.naukimg.com/s/4/100/i/naukri_Logo.png" alt="Naukri Logo" />
        </a>

        <MenuToggle onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </MenuToggle>

        <Menu isOpen={menuOpen}>
          <NavList>
            <li>
              <Anchor href="https://www.naukri.com/browse-jobs" target="_blank">Jobs</Anchor>
            </li>
            <li>
              <Anchor href="https://www.naukri.com/top-company-jobs" target="_blank">Companies</Anchor>
            </li>
            <li>
              <Anchor href="https://resume.naukri.com/resume-services?fftid=100001" target="_blank">Services</Anchor>
            </li>
            <li>
              <Anchor as="span" style={{ cursor: "default" }}>Resources</Anchor>
            </li>
          </NavList>

          <ButtonGroup>
            {userName ? (
              <Button onClick={handleSignOut}>Logout</Button>
            ) : (
              <Button onClick={handleSignIn}>Login</Button>
            )}
            <RegisterButton>Register</RegisterButton>
          </ButtonGroup>
        </Menu>
      </Container>
    </Nav>
  );
}
