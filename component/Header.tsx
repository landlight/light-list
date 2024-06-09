import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { supabase } from "../utils/supabaseClient";
import { useRouter } from "next/router";

interface HeaderProps {
  user: any;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      router.push("/login");
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {user && (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}
