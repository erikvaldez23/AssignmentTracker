import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; // Install if necessary: npm install @react-native-picker/picker

const HomeScreen = () => {
    const [assignments, setAssignments] = useState([
        { id: '1', name: 'Math Homework', dueDate: '2025-02-19', course: 'Math 101', type: 'Homework' },
        { id: '2', name: 'Physics Lab Report', dueDate: '2025-02-20', course: 'Physics 201', type: 'Project' },
    ]);
    const [completedAssignments, setCompletedAssignments] = useState([]);

    // Modal States
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentType, setAssignmentType] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [editingAssignment, setEditingAssignment] = useState(null);
    const [viewCompleted, setViewCompleted] = useState(false);

    const courses = ['Math 101', 'Physics 201', 'Computer Science 301', 'History 101'];
    const assignmentTypes = ['Exam', 'Homework', 'Project', 'Quiz'];

    // Handle Adding or Editing Assignments
    const handleSaveAssignment = () => {
        if (!selectedCourse || !assignmentName || !assignmentType || !dueDate) return;

        if (editingAssignment !== null) {
            // Update existing assignment
            const updatedAssignments = assignments.map((item) =>
                item.id === editingAssignment
                    ? { ...item, course: selectedCourse, name: assignmentName, type: assignmentType, dueDate }
                    : item
            );
            setAssignments(updatedAssignments);
            setEditingAssignment(null);
        } else {
            // Add new assignment
            const newAssignment = {
                id: Math.random().toString(),
                course: selectedCourse,
                name: assignmentName,
                type: assignmentType,
                dueDate,
            };
            setAssignments([...assignments, newAssignment]);
        }

        resetForm();
        setAddModalVisible(false);
        setEditModalVisible(false);
    };

    // Open Edit Modal
    const editAssignment = (assignment) => {
        setEditingAssignment(assignment.id);
        setSelectedCourse(assignment.course);
        setAssignmentName(assignment.name);
        setAssignmentType(assignment.type);
        setDueDate(assignment.dueDate);
        setEditModalVisible(true);
    };

    // Mark Assignment as Completed
    const markAsCompleted = (assignmentId) => {
        const completedItem = assignments.find((item) => item.id === assignmentId);
        setCompletedAssignments([...completedAssignments, completedItem]);
        setAssignments(assignments.filter((item) => item.id !== assignmentId));
    };

    // Reset Form Fields
    const resetForm = () => {
        setSelectedCourse('');
        setAssignmentName('');
        setAssignmentType('');
        setDueDate('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeMessage}>Welcome Back, Erik! 🎉</Text>

            {/* Toggle View Completed Assignments */}
            <TouchableOpacity onPress={() => setViewCompleted(!viewCompleted)} style={styles.viewCompletedButton}>
                <Text style={styles.buttonText}>{viewCompleted ? 'Hide Completed' : 'View Completed'}</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>{viewCompleted ? 'Completed Assignments' : 'Upcoming Assignments'}</Text>
            <FlatList
                data={viewCompleted ? completedAssignments : assignments}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.assignmentCard}>
                        <Text style={styles.assignmentName}>{item.name}</Text>
                        <Text style={styles.assignmentDetails}>{item.course} - {item.type}</Text>
                        <Text style={styles.assignmentDate}>Due: {item.dueDate}</Text>

                        {!viewCompleted && (
                            <View style={styles.buttonGroup}>
                                <TouchableOpacity onPress={() => editAssignment(item)} style={styles.editButton}>
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => markAsCompleted(item.id)} style={styles.completeButton}>
                                    <Text style={styles.buttonText}>Complete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            />

            {/* Edit Assignment Modal */}
            <Modal
    animationType="slide"
    transparent={true}
    visible={editModalVisible}
    onRequestClose={() => setEditModalVisible(false)}
>
    <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
            {/* Close Button in the Top-Right Corner */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setEditModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="black" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Edit Assignment</Text>

            <Text style={styles.label}>Course</Text>
            <Picker selectedValue={selectedCourse} onValueChange={setSelectedCourse} style={styles.picker}>
                {courses.map((course, index) => (
                    <Picker.Item key={index} label={course} value={course} />
                ))}
            </Picker>

            <Text style={styles.label}>Assignment Name</Text>
            <TextInput style={styles.input} value={assignmentName} onChangeText={setAssignmentName} />

            <Text style={styles.label}>Assignment Type</Text>
            <Picker selectedValue={assignmentType} onValueChange={setAssignmentType} style={styles.picker}>
                {assignmentTypes.map((type, index) => (
                    <Picker.Item key={index} label={type} value={type} />
                ))}
            </Picker>

            <Text style={styles.label}>Due Date</Text>
            <TextInput style={styles.input} value={dueDate} onChangeText={setDueDate} />

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => setEditModalVisible(false)} style={styles.cancelButton}>
                    <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveAssignment} style={styles.saveButton}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    </View>
</Modal>


        </View>
    );
};

export default HomeScreen;

// Styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F5F5', padding: 20 },
    welcomeMessage: { fontSize: 22, fontWeight: 'bold', marginTop: 20, color: '#333' },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginVertical: 15, color: '#555' },
    assignmentCard: { backgroundColor: 'white', padding: 15, borderRadius: 10, marginVertical: 5, elevation: 2 },
    assignmentName: { fontSize: 16, fontWeight: 'bold' },
    assignmentDetails: { fontSize: 14, color: 'gray' },
    assignmentDate: { fontSize: 14, color: 'gray' },
    buttonGroup: { flexDirection: 'row', marginTop: 10 },
    editButton: { backgroundColor: '#FFA500', padding: 8, borderRadius: 5, marginRight: 5 },
    completeButton: { backgroundColor: '#4CAF50', padding: 8, borderRadius: 5 },
    viewCompletedButton: { backgroundColor: '#007bff', padding: 10, alignItems: 'center', margin: 10, borderRadius: 5 },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
    },
    modalContainer: {
        width: '85%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 5,
        zIndex: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: '600',
    },
    picker: {
        backgroundColor: '#f0f0f0',
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 15,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

