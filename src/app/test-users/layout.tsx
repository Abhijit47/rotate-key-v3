import Footer from '@/components/shared/footer';
import Header from '@/components/shared/header';

export default function TestUsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
