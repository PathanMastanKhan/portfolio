import { useEffect, useState } from "react";
import { CONFIG } from "../config";

const ADMIN_KEY = "pmk_admin_unlocked";

/* ============================================================
   ADMIN MODE — upload/delete UI is hidden from regular visitors.
   Visit yoursite.com/?admin=YOUR_PASSCODE once to unlock it on
   that browser; it stays unlocked until "Exit admin view" is
   clicked or site data/localStorage is cleared.
   ============================================================ */
export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(
    () => localStorage.getItem(ADMIN_KEY) === "true"
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get("admin");

    if (key && CONFIG.ADMIN_PASSCODE && key === CONFIG.ADMIN_PASSCODE) {
      localStorage.setItem(ADMIN_KEY, "true");
      setIsAdmin(true);

      // scrub the passcode out of the visible URL
      params.delete("admin");
      const query = params.toString();
      const cleanUrl =
        window.location.pathname + (query ? `?${query}` : "") + window.location.hash;
      window.history.replaceState({}, "", cleanUrl);
    }
  }, []);

  const exitAdmin = () => {
    localStorage.removeItem(ADMIN_KEY);
    setIsAdmin(false);
  };

  return { isAdmin, exitAdmin };
}
