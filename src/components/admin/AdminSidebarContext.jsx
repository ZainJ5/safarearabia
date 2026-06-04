'use client';
import { createContext, useContext, useState } from 'react';

const SidebarCtx = createContext({ open: false, setOpen: () => {} });

export function AdminSidebarProvider({ children }) {
  const [open, setOpen] = useState(false);
  return <SidebarCtx.Provider value={{ open, setOpen }}>{children}</SidebarCtx.Provider>;
}

export function useAdminSidebar() {
  return useContext(SidebarCtx);
}
