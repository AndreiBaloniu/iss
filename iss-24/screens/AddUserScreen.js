// AddUserScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { ref, set } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";

const AddUserScreen = ({ navigation }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [userEmail, setUserEmail] = useState(""); // State to store user email

  useEffect(() => {
    // Fetch user data on component mount
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email); // Set user email in state
    }
  }, []);

  const AddUser = () => {
    // Create user with email and password
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        // User successfully created
        const username = email.split("@")[0]; // Extract username from email
        const userData = {
          email: email,
          username: username,
          firstName: firstName,
          lastName: lastName,
          role: role,
          status: role === "Employee" ? "Out" : "", // Set default status based on role
        };
        set(ref(db, `users/${email.replace(".", "_")}`), userData)
          .then(() => {
            alert("User added successfully");
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setRole("");
          })
          .catch((error) => {
            alert("Error adding user data: " + error.message);
          });
      })
      .catch((error) => {
        alert("Error creating user: " + error.message);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </View>
      <Text style={styles.heading}>Add User</Text>

      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
      />
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
      />
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
      <Picker
        selectedValue={role}
        style={styles.picker}
        onValueChange={(itemValue) => setRole(itemValue)}
      >
        <Picker.Item label="Select Role" value="" />
        <Picker.Item label="Manager" value="Manager" />
        <Picker.Item label="Employee" value="Employee" />
      </Picker>

      <TouchableOpacity onPress={AddUser} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add User</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back</Text>
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
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    paddingTop: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  addButton: {
    backgroundColor: "#7392CC",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "#7392CC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  backButtonText: {
    fontWeight: "700",
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
    height: 50,
  },
  username: {
    paddingTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  picker: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
});

export default AddUserScreen;
