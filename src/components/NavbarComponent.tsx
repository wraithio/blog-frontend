
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import Link from "next/link";

export function NavbarComponent() {
  return (
    <Navbar fluid rounded>
      <NavbarToggle />
      <NavbarCollapse>
        <NavbarLink as={Link} href="/">Login</NavbarLink>
        <NavbarLink as={Link} href="/Blogs">Blogs</NavbarLink>
        <NavbarLink as={Link} href="/Dashboard">Dashboard</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}
