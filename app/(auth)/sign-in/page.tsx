import SignInCard from "@components/sign-in-card";
import Footer from "@components/footer";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col md:flex-row">
        <div className="flex w-full flex-1 flex-col items-center justify-center p-6 md:w-1/2 md:p-12">
          <SignInCard />
        </div>

        <div className="hidden md:block md:w-1/2 bg-ring" />
      </div>

      <Footer />
    </div>
  );
}
