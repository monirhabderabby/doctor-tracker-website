import PortalSession from "@/components/auth/portal-session";
import { ThemeProvider } from "@/providers/theme/theme-provider";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const SiteLayout = ({ children }: Props) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <PortalSession>{children}</PortalSession>
    </ThemeProvider>
  );
};

export default SiteLayout;
