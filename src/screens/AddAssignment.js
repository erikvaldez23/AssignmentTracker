import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const AddAssignment = ({ navigation }) => {
    const [name, setName] = useState('');
    const [dueDate, setDueDate] = useState('');

    const handleAddAssignment = () => {
        console.log(`Added: ${name} - Due ${dueDate}`);
        navigation.goBack();
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 24 }}>Add Assignment</Text>
            <TextInput
                placeholder="Assignment Name"
                value={name}
                onChangeText={setName}
                style={{ borderBottomWidth: 1, marginBottom: 20, fontSize: 18 }}
            />
            <TextInput
                placeholder="Due Date (YYYY-MM-DD)"
                value={dueDate}
                onChangeText={setDueDate}
                style={{ borderBottomWidth: 1, marginBottom: 20, fontSize: 18 }}
            />
            <Button title="Save" onPress={handleAddAssignment} />
        </View>
    );
};

export default AddAssignment;