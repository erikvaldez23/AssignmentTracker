import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker"; // npm install @react-native-picker/picker

const API_URL = "http://localhost:3000/assignments"; // Change this to your actual backend URL

const HomeScreen = () => {
    const [assignments, setAssignments] = useState([]);
    const [completedAssignments, setCompletedAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch assignments from API
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await fetch(API_URL);
                const data = await response.json();
                setAssignments(data.assignments || []); // Ensure default array if API is empty
            } catch (error) {
                console.error("❌ Error fetching assignments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    // Render loading spinner while fetching
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text>Loading assignments...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeMessage}>Welcome Back, Erik! 🎉</Text>

            <FlatList
                data={assignments}
                keyExtractor={(item) => item.id.toString()} // Ensure ID is a string
                renderItem={({ item }) => (
                    <View style={styles.assignmentCard}>
                        <Text style={styles.assignmentName}>{item.name}</Text>
                        <Text style={styles.assignmentDetails}>{item.course || "No Course"} - {item.type}</Text>
                        <Text style={styles.assignmentDate}>Due: {item.due_date}</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F5F5", padding: 20 },
    welcomeMessage: { fontSize: 22, fontWeight: "bold", marginTop: 20, color: "#333" },
    assignmentCard: { backgroundColor: "white", padding: 15, borderRadius: 10, marginVertical: 5, elevation: 2 },
    assignmentName: { fontSize: 16, fontWeight: "bold" },
    assignmentDetails: { fontSize: 14, color: "gray" },
    assignmentDate: { fontSize: 14, color: "gray" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
