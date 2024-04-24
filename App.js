import React, { useState } from 'react';
import { View, Button, Text, TextInput, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Student } from './Constructor/Student';
import { Table } from './Constructor/Table';
import { Seat } from './Constructor/Seat';

const MainComponent = () => {
  const [students, setStudents] = useState([]);
  const [tables, setTables] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableColor, setTableColor] = useState('');
  const [numberOfSeats, setNumberOfSeats] = useState('');

  const handleNameChange = (text) => {
    setNewStudentName(text);
  };

  const addStudent = () => {
    if (newStudentName.trim() !== '') {
      const newStudent = new Student(newStudentName);
      setStudents([...students, newStudent]);
      setNewStudentName('');
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const createTable = (color, numberOfSeats) => {
    if (color.trim() === '' || isNaN(numberOfSeats) || numberOfSeats <= 0) {
      alert('Please enter a valid color and number of seats.');
      return;
    }

    const tableNumber = tables.length + 1;
    const seats = [];
    for (let i = 1; i <= numberOfSeats; i++) {
      seats.push(new Seat(tableNumber, i, null));
    }
    const newTable = new Table(color, tableNumber, seats);
    setTables([...tables, newTable]);
    setTableColor('');
    setNumberOfSeats('');
  };

  const handleTablePress = (table) => {
    setSelectedTable(table);
    setTableColor(table.color);
    setNumberOfSeats(String(table.seats.length));
    setIsModalVisible(true);
  };

  const saveChanges = () => {
    if (selectedTable && tableColor.trim() !== '' && !isNaN(numberOfSeats) && numberOfSeats > 0) {
      const updatedTable = { ...selectedTable, color: tableColor };
      const newSeats = [];
      for (let i = 1; i <= parseInt(numberOfSeats); i++) {
        if (i <= selectedTable.seats.length) {
          newSeats.push(selectedTable.seats[i - 1]);
        } else {
          newSeats.push(new Seat(selectedTable.number, i, null));
        }
      }
      updatedTable.seats = newSeats;
      const updatedTables = tables.map(table => (table.number === selectedTable.number ? updatedTable : table));
      setTables(updatedTables);
      setIsModalVisible(false);
      setSelectedTable(null);
      setTableColor('');
      setNumberOfSeats('');
    } else {
      alert('Please enter valid color and number of seats.');
    }
  };

  const deleteTable = () => {
    const updatedTables = tables.filter(table => table !== selectedTable);
    setTables(updatedTables);
    setIsModalVisible(false);
    setSelectedTable(null);
    setTableColor('');
    setNumberOfSeats('');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        {/* Input for adding a new student */}
        <TextInput
          style={styles.input}
          placeholder="Enter student name"
          value={newStudentName}
          onChangeText={handleNameChange}
        />
        <Button title="Add Student" onPress={addStudent} />

        {/* Modal to display table info */}
        <Modal visible={isModalVisible} animationType="slide" onRequestClose={toggleModal}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Table</Text>
            <TextInput
              style={styles.input}
              placeholder="Table Color"
              value={tableColor}
              onChangeText={setTableColor}
            />
            <TextInput
              style={styles.input}
              placeholder="Number of Seats"
              value={numberOfSeats}
              onChangeText={setNumberOfSeats}
              keyboardType="numeric"
            />
            <Button title="Save Changes" onPress={saveChanges} />
            <Button title="Delete Table" onPress={deleteTable} />
            <Button title="Cancel" onPress={toggleModal} />
          </View>
        </Modal>

        {/* Section to create a table */}
        <View style={styles.tableCreationSection}>
          <TextInput
            style={[styles.input, { marginBottom: 10 }]}
            placeholder="Table Color"
            value={tableColor}
            onChangeText={setTableColor}
          />
          <TextInput
            style={styles.input}
            placeholder="Number of Seats"
            value={numberOfSeats}
            onChangeText={setNumberOfSeats}
            keyboardType="numeric"
          />
          <Button title="Create Table" onPress={() => createTable(tableColor, parseInt(numberOfSeats))} />

          {/* Display the tables */}
          <View style={styles.tablesContainer}>
            {tables.map((table, index) => (
              <TouchableOpacity key={index} onPress={() => handleTablePress(table)}>
                <View style={[styles.table, { borderColor: table.color }]}>
                  <View style={styles.seatsContainer}>
                    {table.seats.map((seat, seatIndex) => (
                      <View key={seatIndex} style={styles.seat} />
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  tableCreationSection: {
    marginTop: 20,
    width: '100%',
  },
  tablesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  table: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginRight: 20,
    marginBottom: 20,
  },
  seatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  seat: {
    width: 20,
    height: 20,
    backgroundColor: 'gray',
    margin: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default MainComponent;
