"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@components/ui/button";

interface HomeLogoProps {
  href?: string;
  src?: string;
  alt?: string;
  size?: number;
}

export function HomeLogo({
  href = "/",
  src = "/favicon-light.svg",
  alt = "Logo Colsof",
  size = 24,
}: HomeLogoProps) {
  return (
    <Link href={href} aria-label="Volver al inicio">
      <Button variant="info" size="icon">
        <Image src={src} alt={alt} width={size} height={size} />
      </Button>
    </Link>
  );
}