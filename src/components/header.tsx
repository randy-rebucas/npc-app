import { Separator } from "@radix-ui/react-separator";
import Breadcrumbs from "./breadcrumbs";
import { SidebarTrigger } from "./ui/sidebar";

interface Breadcrumb {
  label: string;
  href: string;
  active?: boolean;
}

export default function Header({ breadcrumbs }: { breadcrumbs: Breadcrumb[] }) {
  return (
    <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumbs breadcrumbs={breadcrumbs} />
    </header>
  );
}