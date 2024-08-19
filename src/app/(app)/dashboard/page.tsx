import { AuthButton } from "@/components/Signout";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>Inside Dashboard</p>
      < AuthButton />
      
    </main>
  );
}



