import { Separator } from '@/components/ui/separator';
import CTASection from '@/features/home/components/cta-section';
import FeaturesSection from '@/features/home/components/features-section';
import HeroSection from '@/features/home/components/hero-section';
import LikedProperty from '@/features/home/components/liked-property';
import ReadyToSwap from '@/features/home/components/ready-to-swap';
import TrendingHomeSection from '@/features/home/components/trending-home-section';

// import { caller, HydrateClient, prefetch, trpc } from "@/trpc/server";
// import { getTranslations } from "next-intl/server";
// import { ErrorBoundary } from "react-error-boundary";
// import { ClientGreeting } from "@/components/client-greeting";
// import TestJobs from "@/components/test-jobs";

export default function Home() {
  // const greeting = await caller.hello({ text: "Hello from server" });
  // prefetch(
  //   trpc.hello.queryOptions({
  //     text: "Hello from server",
  //   }),
  // );

  // const t = await getTranslations();

  return (
    <main
    // className={
    //   "max-w-(--breakpoint-xl) mx-auto px-4 2xl:px-0 space-y-8 py-8"
    // }
    >
      <HeroSection />

      <TrendingHomeSection />

      <ReadyToSwap />

      <LikedProperty />

      <FeaturesSection />

      <CTASection />
      <Separator />

      {/* <div className={"space-y-6"}>
          <div>{greeting.greeting}</div>

          <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <ClientGreeting />
          </ErrorBoundary>

          <TestJobs />

          <div className={"space-y-5"}>
            <h1 className={"font-display text-7xl font-extrabold"}>
              {t(
                "hello-world-this-is-a-test-of-the-new-font-loading-system-thefont-should-load-without-any-issues-and-there-should-be-no-flashes-of-unstyled-text",
              )}
            </h1>
            <h1 className={"font-body text-7xl font-bold"}>
              {t(
                "hello-world-this-is-a-test-of-the-new-font-loading-system-thefont-should-load-without-any-issues-and-there-should-be-no-flashes-of-unstyled-text",
              )}
            </h1>
            <h1 className={"font-mono text-7xl font-bold"}>
              {t(
                "hello-world-this-is-a-test-of-the-new-font-loading-system-thefont-should-load-without-any-issues-and-there-should-be-no-flashes-of-unstyled-text",
              )}
            </h1>
          </div>
        </div> */}
    </main>
  );
}
