import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Desk",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
