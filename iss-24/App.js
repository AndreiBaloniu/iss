import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TestScreen from "../iss-24/screens/TestScreen";
import Login from "./screens/Login";
import WelcomeManager from "./screens/WelcomeManager";
import WelcomeEmployee from "./screens/WelcomeEmployee";
import AssignmentsManager from "./screens/AssignmentsManager";
import EmployeesManager from "./screens/EmployeesManager";
import AssignmentsEmployee from "./screens/AssignmentsEmployee";
import AddUserScreen from "./screens/AddUserScreen";
import AddAssignment from "./screens/AddAssigment";
import AddSubscriptionScreen from "./screens/AddSubscriptionScreen";

const Stack = createStackNavigator(); // Definirea obiectului Stack

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={Login}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="WelcomeManager"
          component={WelcomeManager}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="WelcomeEmployee"
          component={WelcomeEmployee}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="AssignmentsManager"
          component={AssignmentsManager}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="EmployeesManager"
          component={EmployeesManager}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="AssignmentsEmployee"
          component={AssignmentsEmployee}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="AddUserScreen"
          component={AddUserScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="AddAssignment"
          component={AddAssignment}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="AddSubscriptionScreen"
          component={AddSubscriptionScreen}
        />

        {/* Adăugați alte ecrane aici */}
      </Stack.Navigator>
      {/* <StatusBar style="auto" /> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
