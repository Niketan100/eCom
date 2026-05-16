"use client";

import styled from "styled-components";

export const SidebarWrapper = styled.aside`
  width: 16rem;
  height: 100vh;
  background: #0b0f19;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  padding: 1rem 0.8rem;
  transition: all 0.3s ease;
  z-index: 100;
`;

export const SidebarTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 0 0.4rem;
`;

export const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

export const LogoBox = styled.div`
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 0.7rem;
  background: #d7ff3f;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  font-weight: 700;
  font-size: 1rem;
`;

export const LogoText = styled.h2`
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
`;

export const MenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

export const MenuItem = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  background: ${({ active }) =>
    active ? "rgba(215,255,63,0.12)" : "transparent"};

  border: 1px solid
    ${({ active }) =>
      active ? "rgba(215,255,63,0.25)" : "transparent"};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

export const MenuIcon = styled.div<{ active?: boolean }>`
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ active }) => (active ? "#d7ff3f" : "#8b93a7")};
`;

export const MenuLabel = styled.span<{ active?: boolean }>`
  font-size: 0.95rem;
  font-weight: 500;

  color: ${({ active }) => (active ? "#ffffff" : "#9ca3af")};
`;

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.05);
  margin: 1.4rem 0;
`;

export const BottomSection = styled.div`
  margin-top: auto;
`;

export const ProfileCard = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.9rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;

export const Avatar = styled.img`
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 50%;
  object-fit: cover;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const UserName = styled.h4`
  color: white;
  font-size: 0.92rem;
  font-weight: 600;
`;

export const UserEmail = styled.p`
  color: #7d8597;
  font-size: 0.78rem;
  margin-top: 0.15rem;
`;

export const SidebarHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  padding: 0 0.4rem;
`;

