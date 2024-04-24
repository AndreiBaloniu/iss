import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from "react-native";
import { ref, onValue, remove } from "firebase/database";
import { db, auth } from "../firebase";

const AssignmentManager = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [assignmentDescription, setAssignmentDescription] = useState(""); // New state for assignment description

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const croppedEmail = user.email.substring(0, user.email.indexOf("@"));
        setUserEmail(croppedEmail);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onValue(ref(db, "assignments"), (snapshot) => {
      const assignmentsData = snapshot.val();
      if (assignmentsData) {
        const assignmentsList = Object.keys(assignmentsData).reduce((acc, key) => {
          const assignmentsForKey = Object.entries(assignmentsData[key]).map(([assignmentKey, assignment]) => {
            return { key: assignmentKey, ...assignment };
          });
          return [...acc, ...assignmentsForKey];
        }, []);
        setAssignments(assignmentsList);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleDeleteAssignment = () => {
    if (selectedAssignment) {
      remove(ref(db, `assignments/${selectedAssignment.assignedTo.replace(".", "_")}/${selectedAssignment.key}`))
        .then(() => {
          setDeleteModalVisible(false);
          setSelectedAssignment(null);
          Alert.alert("Success", "Assignment deleted successfully.");
        })
        .catch((error) => {
          Alert.alert("Error", "Failed to delete assignment: " + error.message);
        });
    }
  };

  const openDeleteModal = (assignment) => {
    setSelectedAssignment(assignment);
    setAssignmentDescription(assignment.description || ""); // Set assignment description if exists, otherwise set it to empty string
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setSelectedAssignment(null);
    setAssignmentDescription(""); // Clear assignment description
    setDeleteModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
      </View>
      <Text style={styles.heading}>Assignments</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {assignments.map((assignment, index) => (
          <TouchableOpacity
            key={index}
            style={styles.assignmentItem}
            onPress={() => openDeleteModal(assignment)}
          >
            <Text style={styles.assignmentText}>
              {index + 1}. {assignment.name}
            </Text>
            <Text style={styles.assignmentDetails}>
              Deadline: {new Date(assignment.deadline).toLocaleDateString()}
            </Text>
            <Text style={styles.assignmentDetails}>
              Assigned to: {assignment.assignedTo}
            </Text>
            {assignment.description && (
  <Text style={styles.assignmentDetails}>
    Description: {assignment.description}
  </Text>
)}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      {/* Delete Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={closeDeleteModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeading}>Delete Assignment</Text>
            <Text style={styles.modalText}>Are you sure you want to delete this assignment?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleDeleteAssignment} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeDeleteModal} style={[styles.modalButton, styles.cancelButton]}>
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    elevation: 5,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: "#7392CC",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  cancelButton: {
    backgroundColor: "gray",
  },
  cancelButtonText: {
    color: "white",
  },
});

export default AssignmentManager;
