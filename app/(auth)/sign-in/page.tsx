import SignInCard from "@components/sign-in-card";
import Header from "@components/header";
import Footer from "@components/footer";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SignInCard />
      <div className="flex-1">
        <Footer />
      </div>
    </div>
  );
}