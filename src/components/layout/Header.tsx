import { ModeToggle } from "@/components/Toogle"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import Link from "next/link"
import { Logo } from "@/components/layout/Logo"

export function Header() {
  return (
    <header className="sticky top-1 z-50 w-full border-b bg-background/65 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 items-center justify-between px-4 container mx-auto">
        <Logo />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/blog">Blog</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
