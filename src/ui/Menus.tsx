import React, { createContext, useState, useContext, MouseEvent } from "react"
import styled from "styled-components"
import { HiEllipsisVertical } from "react-icons/hi2"
import { createPortal } from "react-dom"
import { useOutsideClick } from "../hooks/useOutsideClick"

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`
type ListPropsType = {
  position: {
    x: number
    y: number
  }
  ref: React.RefObject<HTMLDivElement>
}

const StyledList = styled.ul<ListPropsType>`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
`

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`

interface MenuProps {
  children: React.ReactNode
}

type MenuContextType = {
  openId: string
  close: () => void
  open: (id: string) => void
  position: { x: number; y: number }
  setPosition: (position: { x: number; y: number }) => void
}

const MenusContext = createContext<MenuContextType | null>(null)

function Menus({ children }: MenuProps) {
  const [openId, setOpenId] = useState("")
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const close = () => setOpenId("")
  const open = setOpenId

  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  )
}

function Toggle({ id }: { id: string }) {
  const { openId, close, open, setPosition } = useContext(
    MenusContext,
  ) as MenuContextType

  function handleClick(e: MouseEvent) {
    const rect = (e.target as HTMLElement)
      .closest("button")
      ?.getBoundingClientRect()

    setPosition({
      x: window.innerWidth - rect!.width - rect!.x,
      y: rect!.y + rect!.height + 8,
    })
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    openId === "" || openId !== id ? open(id) : close()
  }

  return (
    // eslint-disable-next-line react/jsx-no-bind
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  )
}

interface ListProps {
  children: React.ReactNode
  id: string
}

function List({ id, children }: ListProps) {
  const { openId, position, close } = useContext(
    MenusContext,
  ) as MenuContextType
  const ref = useOutsideClick({ handler: close })

  if (openId !== id) return null

  return createPortal(
    <StyledList position={position} ref={ref}>
      {children}
    </StyledList>,
    document.body,
  )
}

interface ButtonProps {
  children: React.ReactNode
  icon: React.ReactNode
  onClick: () => void
}

function Button({ children, icon, onClick }: ButtonProps) {
  const { close } = useContext(MenusContext) as MenuContextType

  function handleClick() {
    onClick?.()
    close()
  }
  return (
    <li>
      {/* eslint-disable-next-line react/jsx-no-bind */}
      <StyledButton onClick={handleClick}>
        {icon}
        <span>{children}</span>
      </StyledButton>
    </li>
  )
}

Menus.Menu = Menu
Menus.Toggle = Toggle
Menus.List = List
Menus.Button = Button

export default Menus
