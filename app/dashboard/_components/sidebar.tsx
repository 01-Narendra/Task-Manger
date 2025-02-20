import React from 'react'

import { cn } from "@/lib/utils";
import { CheckCircle2, Layout, List, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LogoutButton from './logout';



const Sidebar = () => {

    const pathname = usePathname();
    const sidebarItems = [
      {
        title: "Total Tasks",
        path: "/dashboard/total-tasks",
        icon: List,
      },
      {
        title: "Completed Tasks",
        path: "/dashboard/completed-tasks",
        icon: CheckCircle2,
      },
    ];

  return (
    <aside className="w-64 mt-5 shrink-0">
          <nav className="space-y-2">
            <Link href="/dashboard" className="block mb-6">
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start",
                  pathname === "/dashboard" && "bg-primary text-primary-foreground"
                )}
              >
                Overview
              </Button>
            </Link>
            {sidebarItems.map((item) => (
              <div className="mb-10" key={item.path}>
                <Link key={item.path} href={item.path}>
                    <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start",
                        pathname === item.path && "bg-primary text-primary-foreground"
                    )}
                    >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                    </Button>
                </Link>
              </div>
            ))}
            <LogoutButton />
          </nav>
        </aside>
  )
}

export default Sidebar