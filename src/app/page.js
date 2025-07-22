"use client"; // Add this line to mark this as a client component

import { usePathname } from "next/navigation"; // Import from next/navigation
import CyberSecurityLandingPage from "./landingPage/page";
import SignUp from "./landingPage/signup/page";
import Layout from './landingPage/layout'; // Adjust the path as needed

export default function Home() {
  const pathname = usePathname(); // Get the current path

  return (
    <Layout> {/* Ensure Layout wraps the entire content */}
      {/* Conditionally render based on the route */}
      {pathname === "/" ? (
        <CyberSecurityLandingPage />
      ) : pathname === "/signup" ? (
        <SignUp />
      ) : (
        <div>Page not found</div> // Default fallback
      )}
    </Layout>
  );
}
