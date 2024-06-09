import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import type { AppProps } from "next/app";
import { User } from "@supabase/supabase-js";
import Layout from "../components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null);

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
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <Layout user={user}>
      <Component {...pageProps} user={user} />
    </Layout>
  );
}

export default MyApp;
