import Link from "next/link";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";

const Header = ({ children, className }: HeaderProps) => {
  return (
    <div className={cn("header", className)}>
      <Link href="/" className="md:flex-1">
        {/* Desktop Logo */}
        <Image
          src="/assets/icons/logo.svg"
          alt="Logo Image"
          width={120}
          height={32}
          className="hidden md:block"
        ></Image>

        {/* Mobile Logo */}
        <Image
          src="/assets/icons/logo.svg"
          alt="Logo Image"
          width={32}
          height={32}
          className="mr-2 md:hidden"
        ></Image>
      </Link>
      {children}
    </div>
  );
};

export default Header;
