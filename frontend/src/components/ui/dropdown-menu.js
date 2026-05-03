import React, { useState } from "react";

let isOpenGlobal = false;

export const DropdownMenu = ({ children }) => (
  <div className="relative">{children}</div>
);

export const DropdownMenuTrigger = ({ children }) => {
  const [open, setOpen] = useState(false);
  isOpenGlobal = open;

  return (
    <div onClick={() => setOpen(!open)} className="cursor-pointer">
      {children}
    </div>
  );
};

export const DropdownMenuContent = ({ children }) => {
  if (!isOpenGlobal) return null;

  return (
    <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded shadow-lg z-50">
      {children}
    </div>
  );
};

export const DropdownMenuItem = ({ children, onClick }) => (
  <div
    onClick={onClick}
    className="px-4 py-2 text-sm text-white hover:bg-zinc-800 cursor-pointer flex items-center gap-2"
  >
    {children}
  </div>
);

export const DropdownMenuLabel = ({ children }) => (
  <div className="px-4 py-2 text-xs text-zinc-400">
    {children}
  </div>
);

export const DropdownMenuSeparator = () => (
  <div className="border-t border-zinc-800 my-1" />
);