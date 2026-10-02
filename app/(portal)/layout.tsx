import { ReactNode } from "react";
import PortalSession from "@/components/auth/portal-session";

interface Props {
  children: ReactNode;
}

const PortalLayout = ({ children }: Props) => {
  return <PortalSession>{children}</PortalSession>;
};

export default PortalLayout;
