//import type { Metadata } from "next";
import Container from '@/components/common/Container';
import TopNav from '@/components/TopNav';

/*export const metadata: Metadata = {
  title: "GW Skill Bar",
  description: "Drag and drop a GW Skillbar",
};*/

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Container>
      <TopNav />
      {children}
    </Container>
  );
}
