import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import {
  ref,
  onValue,
  query,
  orderByChild,
  equalTo,
  remove,
} from "firebase/database";
import { db, auth } from "../firebase";

const AssignmentsEmployee = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState("");
  const [emailPrefix, setEmailPrefix] = useState(""); // State to store email prefix
  const [assignments, setAssignments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userEmail = currentUser.email; // Set user email in state
      setUserEmail(userEmail);

      // Extract email prefix before "@" symbol
      const prefix = userEmail.split("@")[0];
      setEmailPrefix(prefix);

      // Query assignments for the current user's email
      const assignmentsRef = ref(
        db,
        `assignments/${userEmail.replace(".", "_")}`
      );

      const userAssignmentsQuery = query(
        assignmentsRef,
        orderByChild("assignedTo"),
        equalTo(userEmail)
      );

      const unsubscribe = onValue(userAssignmentsQuery, (snapshot) => {
        const assignmentsData = snapshot.val();
        if (assignmentsData) {
          const assignmentList = Object.values(assignmentsData);
          setAssignments(assignmentList);
        } else {
          setAssignments([]); // No assignments found for the user
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, "assignments"), (snapshot) => {
      const assignmentsData = snapshot.val();
      if (assignmentsData) {
        const assignmentList = Object.entries(assignmentsData)
          .map(([assignedTo, assignments]) => {
            return Object.entries(assignments).map(
              ([assignmentId, assignmentData]) => {
                return { id: assignmentId, assignedTo, ...assignmentData };
              }
            );
          })
          .flat();
        setAssignments(assignmentList);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDelete = (assignedToEmail, assignmentId) => {
    // Construct the reference to the assignment to be deleted
    const assignmentRef = ref(
      db,
      `assignments/${assignedToEmail.replace(".", "_")}/${assignmentId}`
    );

    // Remove the assignment from the database
    remove(assignmentRef)
      .then(() => {
        console.log(assignedToEmail.replace(".", "_"));
        console.log(assignmentId);
        console.log("Assignment deleted successfully");
        // Update the local state to reflect the deletion
        setAssignments(
          assignments.filter((assignment) => assignment.id !== assignmentId)
        );
        setModalVisible(false); // Close the modal after deletion
      })
      .catch((error) => {
        console.error("Error deleting assignment:", error);
      });
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.topBar}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </View>

      {/* Assignment List Section */}
      <Text style={styles.heading}>Assignments</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {assignments.map((assignment, index) => (
          <TouchableOpacity
            key={index}
            style={styles.assignmentItem}
            onPress={() => {
              setSelectedAssignment(assignment);
              setModalVisible(true);
            }}
          >
            <Text style={styles.assignmentText}>
              {index + 1}. {assignment.name}
            </Text>
            <Text style={styles.assignmentDetails}>
              Deadline: {assignment.deadline}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal Section */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          {selectedAssignment && (
            <>
              <Text style={styles.assignmentText}>
                {selectedAssignment.name}
              </Text>
              <Text style={styles.assignmentDetails}>
                Deadline: {selectedAssignment.deadline}
              </Text>
              <Text style={styles.assignmentDetails}>
                Description: {selectedAssignment.description}
              </Text>

              {/* Delete Button */}
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  console.log("Selected Assignment:", selectedAssignment);
                  handleDelete(
                    selectedAssignment.assignedTo,
                    selectedAssignment.id
                  );
                }}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>

              {/* Close Button */}
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>

      {/* Back Button */}
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
  heading: {
    paddingTop: 10,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  assignmentItem: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  assignmentText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  assignmentDetails: {
    fontSize: 14,
    marginBottom: 3,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButton: {
    backgroundColor: "#7392CC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 10,
  },
  buttonText: {
    fontWeight: "700",
    color: "black",
  },
});

export default AssignmentsEmployee;
