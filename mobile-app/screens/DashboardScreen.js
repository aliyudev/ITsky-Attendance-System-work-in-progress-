import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import axios from 'axios';

// Replace with your computer's IP address
const API_BASE_URL = 'http://192.168.2.196:3000/api'; // Your computer's IP address (mobile hotspot)

export default function DashboardScreen({ navigation }) {
  const [userEmail, setUserEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clockInMessage, setClockInMessage] = useState('');
  const [locationStatus, setLocationStatus] = useState('');
  const [statusIndicator, setStatusIndicator] = useState('#ffa500');
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [alreadyClockedIn, setAlreadyClockedIn] = useState(false);

  useEffect(() => {
    loadUserData();
    loadCalendar();
  }, []);

  const loadUserData = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      setUserEmail(email);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadCalendar = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.get(`${API_BASE_URL}/stats`, {
        headers: { Authorization: token },
      });
      setAttendanceStats(response.data);
      
      // Check if already clocked in today
      const today = new Date().toISOString().slice(0, 10);
      const todayRecord = response.data.records.find(record => record.date === today);
      setAlreadyClockedIn(!!todayRecord);
      
      if (todayRecord) {
        setClockInMessage('✅ Already clocked in today');
        setStatusIndicator('#4CAF50'); // Green
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Location Permission Required',
        'This app needs location access to verify you are at the office for attendance.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  const getGPSLocation = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 10000,
      });
      return location;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  };

  const handleClockIn = async () => {
    if (alreadyClockedIn) {
      Alert.alert(
        'Already Clocked In',
        'You have already clocked in today. You can only clock in once per day.',
        [{ text: 'OK' }]
      );
      return;
    }

    setIsLoading(true);
    setClockInMessage('');
    setLocationStatus('');
    setStatusIndicator('#ffa500'); // Orange - checking
    
    try {
      // Step 1: Request location permission
      setLocationStatus('Requesting GPS location...');
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setIsLoading(false);
        return;
      }

      // Step 2: Get current location
      const position = await getGPSLocation();
      if (!position) {
        throw new Error('GPS location is required. Please allow location access.');
      }

      setLocationStatus('Verifying location with server...');

      // Step 3: Verify location with server
      const locationRes = await axios.post(`${API_BASE_URL}/verify-location`, {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      });

      const locationData = locationRes.data;

      if (!locationData.allowed) {
        setStatusIndicator('#f44336'); // Red - error
        setLocationStatus(`Access denied: ${locationData.distance}m from office`);
        throw new Error(`Access denied: You must be at the office location (${locationData.distance}m from office)`);
      }

      setStatusIndicator('#4CAF50'); // Green - success
      setLocationStatus(`Location verified (${locationData.distance}m from office)`);
      setClockInMessage('Clocking in...');

      // Step 4: Clock in
      const token = await AsyncStorage.getItem('userToken');
      const clockInResponse = await axios.post(
        `${API_BASE_URL}/clockin`,
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        },
        {
          headers: { Authorization: token },
        }
      );

      setClockInMessage(`✅ ${clockInResponse.data.message}`);
      setLocationStatus(`✅ Clocked in successfully (${locationData.distance}m from office)`);
      setAlreadyClockedIn(true);
      
      // Reload attendance stats
      loadCalendar();

    } catch (error) {
      console.error('Clock in error:', error);
      setStatusIndicator('#f44336'); // Red - error
      
      // Better error handling for different status codes
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.message;
        if (errorMessage === 'Already clocked in today') {
          setLocationStatus('Already clocked in today');
          setClockInMessage('You have already clocked in for today');
        } else {
          setLocationStatus('Bad Request');
          setClockInMessage(errorMessage || 'Invalid request data');
        }
      } else if (error.response?.status === 403) {
        const errorData = error.response.data;
        if (errorData.details) {
          setLocationStatus(`Location Error: ${errorData.details.error || errorData.message}`);
          setClockInMessage(`Access Denied: ${errorData.details.distance}m from office`);
        } else {
          setLocationStatus('Access Denied: Location verification failed');
          setClockInMessage('You must be at the office location to clock in');
        }
      } else if (error.response?.status === 401) {
        setLocationStatus('Authentication Error');
        setClockInMessage('Please login again');
      } else {
        setLocationStatus(error.message);
        setClockInMessage(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.multiRemove(['userToken', 'userEmail', 'isAdmin']);
            navigation.replace('Login');
          },
        },
      ]
    );
  };

  const renderCalendar = () => {
    if (!attendanceStats) return null;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const presentDays = new Set(attendanceStats.records.map(r => Number(r.date.split('-')[2])));
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const firstDay = new Date(year, month, 1).getDay();

    let calendarRows = [];
    
    // Header row
    let headerRow = [];
    weekDays.forEach(day => {
      headerRow.push(
        <View key={day} style={styles.calendarHeader}>
          <Text style={styles.calendarHeaderText}>{day}</Text>
        </View>
      );
    });
    calendarRows.push(
      <View key="header" style={styles.calendarRow}>
        {headerRow}
      </View>
    );

    // Calendar days
    let currentRow = [];
    for (let i = 0; i < firstDay; i++) {
      currentRow.push(<View key={`empty-${i}`} style={styles.calendarCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      if ((firstDay + day - 1) % 7 === 0 && day !== 1) {
        calendarRows.push(
          <View key={`row-${Math.floor((firstDay + day - 1) / 7)}`} style={styles.calendarRow}>
            {currentRow}
          </View>
        );
        currentRow = [];
      }

      const isPresent = presentDays.has(day);
      currentRow.push(
        <View key={day} style={[styles.calendarCell, isPresent && styles.calendarCellPresent]}>
          <Text style={[styles.calendarCellText, isPresent && styles.calendarCellTextPresent]}>
            {day}
          </Text>
        </View>
      );
    }

    // Add the last row
    if (currentRow.length > 0) {
      calendarRows.push(
        <View key="last-row" style={styles.calendarRow}>
          {currentRow}
        </View>
      );
    }

    return (
      <View style={styles.calendarContainer}>
        {calendarRows}
        <Text style={styles.statsText}>
          <Text style={styles.bold}>Days Present:</Text> {attendanceStats.daysPresent} / {attendanceStats.daysThisMonth}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {userEmail}!</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.clockInSection}>
        <TouchableOpacity
          style={[
            styles.clockInButton, 
            isLoading && styles.buttonDisabled,
            alreadyClockedIn && styles.buttonClockedIn
          ]}
          onPress={handleClockIn}
          disabled={isLoading || alreadyClockedIn}
        >
          <Text style={styles.clockInButtonText}>
            {isLoading ? 'Processing...' : alreadyClockedIn ? 'Already Clocked In' : 'Clock In'}
          </Text>
        </TouchableOpacity>

        {clockInMessage ? (
          <Text style={styles.clockInMessage}>{clockInMessage}</Text>
        ) : null}

        {locationStatus ? (
          <View style={styles.locationStatusContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: statusIndicator }]} />
            <Text style={styles.locationStatusText}>{locationStatus}</Text>
          </View>
        ) : null}


      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Attendance Calendar (This Month)</Text>
        {renderCalendar()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  clockInSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  clockInButton: {
    backgroundColor: '#dc2626',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  buttonClockedIn: {
    backgroundColor: '#4CAF50',
  },
  clockInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  clockInMessage: {
    marginTop: 8,
    color: '#198754',
    fontWeight: '600',
    fontSize: 14,
  },
  locationStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  locationStatusText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  statsSection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111',
  },
  calendarContainer: {
    marginTop: 8,
  },
  calendarRow: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  calendarHeader: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f3f3',
    borderWidth: 1,
    borderColor: '#eee',
  },
  calendarHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  calendarCell: {
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  calendarCellPresent: {
    backgroundColor: '#dc2626',
  },
  calendarCellText: {
    fontSize: 14,
    color: '#111',
  },
  calendarCellTextPresent: {
    color: '#fff',
    fontWeight: '700',
  },
  statsText: {
    marginTop: 8,
    fontSize: 16,
    color: '#111',
  },
  bold: {
    fontWeight: 'bold',
  },
}); 