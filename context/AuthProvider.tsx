import {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/supabase";
import { router, SplashScreen } from "expo-router";
import { AppState } from "react-native";

SplashScreen.preventAutoHideAsync();

AppState.addEventListener("change", (state) => {
	if (state === "active") supabase.auth.startAutoRefresh();
	else supabase.auth.stopAutoRefresh();
});

const AuthContext = createContext({ session: null as Session | null });

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: PropsWithChildren) => {
	const [session, setSession] = useState<Session | null>(null);

	useEffect(() => {
		supabase.auth
			.getSession()
			.then(({ data: { session } }) => setSession(session));

		supabase.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});

		router.replace("/(tabs)");
		setTimeout(() => SplashScreen.hideAsync(), 1000);
	}, []);

	return (
		<AuthContext.Provider value={{ session }}>
			{children}
		</AuthContext.Provider>
	);
};
