import CustomHeader from "@/components/CustomHeader";
import { Provider } from "react-redux";
import { Stack } from "expo-router";
import { store } from "@/redux/store";
import {StatusBar} from "expo-status-bar";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayoutNav() {
  return (
    <Provider store={store}>
        <StatusBar style="dark" />
        <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="GuessPlayer"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="PlayerDetailModal"
          options={{
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="Filter"
          options={{
            headerShown: false,
          }}/>
      </Stack>
    </Provider>
  );
}
