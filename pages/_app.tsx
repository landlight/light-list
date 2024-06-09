import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import type { AppProps } from "next/app";
import { User } from "@supabase/supabase-js";
import Layout from "../components/Layout";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
      } else {
        setUser(session?.user ?? null);
        if (!session) {
          router.push("/login");
        }
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (!session) {
          router.push("/login");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <ThemeProvider theme={theme}>
      <Layout user={user}>
        <Component {...pageProps} user={user} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
