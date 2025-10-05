import { useState, useEffect } from "react";

export type UserRole = "cio" | "rco" | "itso" | "default";

export function useUserRole() {
  const [role, setRole] = useState<UserRole>("default");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setEmail(userEmail);
      const lowerEmail = userEmail.toLowerCase();
      
      if (lowerEmail.includes("cio")) {
        setRole("cio");
      } else if (lowerEmail.includes("rco")) {
        setRole("rco");
      } else if (lowerEmail.includes("itso")) {
        setRole("itso");
      } else {
        setRole("default");
      }
    }
  }, []);

  return { role, email };
}
