import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { auth } from "../firebase";

const WelcomeManager = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState("");
  const [emailPrefix, setEmailPrefix] = useState(""); // State to store email prefix

  useEffect(() => {
    // Fetch user data on component mount
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email); // Set user email in state

      // Extract email prefix before "@" symbol
      const prefix = currentUser.email.split("@")[0];
      setEmailPrefix(prefix);
    }
  }, []);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login");
        console.log("Log-out");
      })
      .catch((error) => alert(error.message));
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const croppedEmail = user.email.substring(0, user.email.indexOf("@"));
        setUserEmail(croppedEmail);
      }
    });

    return unsubscribe;
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </View>
      <Text style={styles.welcome}>Welcome</Text>
      <Text style={styles.welcome}>{emailPrefix}!</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("EmployeesManager")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>View employees</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("AssignmentsManager")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>View assignments</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("AddAssignment")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Add assignment</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("AddUserScreen")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Add user</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleSignOut();
          navigation.navigate("Login");
        }}
        style={styles.logoutButton}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "110%",
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  logo: {
    width: 50,
    height: 50
    ,
  },
  username: {
    paddingTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  welcome: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#7392CC",
    width: "90%",
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 25,
  },
  buttonText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },
  logoutButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#7392CC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: "black",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default WelcomeManager;
