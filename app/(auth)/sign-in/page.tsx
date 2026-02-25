import SignInCard from "@components/sign-in-card";
import Header from "@components/header";
import Footer from "@components/footer";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 grid place-items-center px-4">
        <SignInCard />
      </main>
      <Footer />
    </div>
  );
}
