import Container from '@/components/common/Container';
import TopNav from '@/components/TopNav';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container>
      <TopNav href="/" label="Back" />
      {children}
    </Container>
  );
}
