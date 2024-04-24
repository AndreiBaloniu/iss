import React, { useState } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { auth, db } from "../firebase";
import { get, ref } from "firebase/database";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // User successfully authenticated
        const user = userCredential.user;
        console.log("Logged in with:", user.email);

        // Query the database to get the user's role based on their email
        get(ref(db, `users/${email.replace(".", "_")}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              const role = userData.role;

              // Navigate to different screens based on the user's role
              if (role === "Manager") {
                navigation.navigate("WelcomeManager");
              } else if (role === "Employee") {
                navigation.navigate("WelcomeEmployee");
              } else {
                // Handle other roles or cases here
              }
            } else {
              // User data not found in the database
              alert("User data not found for email: " + email);
            }
          })
          .catch((error) => {
            // Error fetching user data from the database
            alert("Error fetching user data: " + error.message);
          });
      })
      .catch((error) => {
        // Authentication error
        alert("Error signing in: " + error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image source={require("../assets/logo2.png")} style={styles.logo} />
      </View>
      <Text style={styles.heading}>Login</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 320,
    height: 250,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: "#7392CC",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 10,
    alignItems: "center",
  },
  loginButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Login;
