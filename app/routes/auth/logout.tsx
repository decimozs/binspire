import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function LogoutRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.clear();

    navigate("/login");
  }, [navigate]);

  return null;
}
