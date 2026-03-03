import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="p-3 sticky top-0 left-0 right-0 z-50 backdrop-blur-sm flex items-center justify-between">
      <Link href="/" className="inline-flex items-center gap-2">
        <Image
          src="/favicon-light.svg"
          alt="COLSOF S.A.S"
          width={50}
          height={50}
          className="size-12 p-2 bg-blue-500 rounded-xl"
        />
        <h1 className="font-semibold text-foreground">Colsof</h1>
      </Link>
    </header>
  );
}
