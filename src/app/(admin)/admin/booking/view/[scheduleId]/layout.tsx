import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import DownloadTable from "@/components/admin/booking/DownloadBookingTable";

export default function layout({ children }: { children: React.ReactNode }) {
    
  return (
    <div className="relative border min-h-[calc(100vh-60px)]">
      <div className="absolute right-5 bottom-8">
        {/* <DownloadTable /> */}
      </div>
      {children}
    </div>
  );
}

     