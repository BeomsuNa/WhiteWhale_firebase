import React, { useState } from 'react';
import { Button } from './button';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from './menubar';

interface MenuBarWithButtonProps {
  openMenu: boolean;
  setOpenMenu: (v: boolean) => void;
}
const MenuBarWithButton: React.FC<MenuBarWithButtonProps> = ({
  openMenu,
  setOpenMenu,
}) => {
  return (
    <div className="flex">
      <Button
        type="button"
        onClick={() => setOpenMenu(!openMenu)}
        className={`mr-5 px-6 py-6 rounded-full w-10 h-10 flex items-center justify-center transition-colors duration-100 
        ${openMenu ? 'bg-slate-500 text-slate-100' : 'hover:bg-slate-500 hover:text-slate-100'}`}
      >
        ☰
      </Button>
      {openMenu && (
        <Menubar className="rounded-3xl bg-slate-500 border-none px-6 py-6 ">
          <MenubarMenu>
            <Button variant="hover" className="rounded-xl w-sm text-red-600">
              🔥지금HOT
            </Button>
            <Button
              variant="hover"
              className="rounded-xl w-sm text-text-black01"
            >
              베스트
            </Button>
            <Button
              variant="hover"
              className="rounded-xl w-sm text-text-black01"
            >
              신상품
            </Button>
            <Button
              variant="hover"
              className="rounded-xl w-sm text-text-black01"
            >
              키보드
            </Button>
            <Button
              variant="hover"
              className="rounded-xl w-sm text-text-black01"
            >
              악세서리
            </Button>
          </MenubarMenu>
        </Menubar>
      )}
    </div>
  );
};

export default MenuBarWithButton;
