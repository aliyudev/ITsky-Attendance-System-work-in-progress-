/**
 * DashboardScreen.js - Main User Dashboard
 * 
 * This is the primary screen for authenticated users in the ITSky Attendance mobile app.
 * It provides a comprehensive interface for clocking in, viewing attendance statistics,
 * and managing user sessions.
 * 
 * Features:
 * - GPS-based clock-in with location verification
 * - Real-time attendance calendar display
 * - User authentication status management
 * - Admin role detection and redirection
 * - Offline data persistence with AsyncStorage
 * 
 * @author ITSky Solutions
 * @version 1.3.0
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { supabase } from '../config/api';

/**
 * DashboardScreen Component
 * 
 * Main dashboard interface for authenticated users. Handles:
 * - User authentication status
 * - GPS location verification
 * - Attendance tracking
 * - Calendar display
 * - Session management
 * 
 * @param {Object} navigation - React Navigation object for screen transitions
 */
export default function DashboardScreen({ navigation }) {
  // State management for user interface and data
  const [userEmail, setUserEmail] = useState(''); // Current user's email
  const [isLoading, setIsLoading] = useState(false); // Loading state for clock-in process
  const [clockInMessage, setClockInMessage] = useState(''); // Success/error messages
  const [locationStatus, setLocationStatus] = useState(''); // GPS status messages
  const [statusIndicator, setStatusIndicator] = useState('#ffa500'); // Visual status indicator color
  const [attendanceStats, setAttendanceStats] = useState(null); // User's attendance data
  const [alreadyClockedIn, setAlreadyClockedIn] = useState(false); // Prevents duplicate clock-ins
  const [selectedDayInfo, setSelectedDayInfo] = useState(null); // Info for clicked day

  /**
   * Component initialization effect
   * Runs on component mount to set up user data and check authentication
   */
  useEffect(() => {
    checkUserType();
    loadUserData();
    loadCalendar();
  }, []);

  /**
   * Check if current user is an admin and redirect if necessary
   * Admins should be redirected to the admin dashboard
   */
  const checkUserType = async () => {
    try {
      const isAdmin = await AsyncStorage.getItem('isAdmin');
      if (isAdmin === 'true') {
        navigation.replace('AdminDashboard');
      }
    } catch (error) {
      console.error('Error checking user type:', error);
    }
  };

  /**
   * Load user email from local storage
   * Displays the current user's email in the welcome message
   */
  const loadUserData = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      setUserEmail(email);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  /**
   * Load user's attendance statistics and calendar data
   * Fetches data from the server and updates the UI
   */
  const loadCalendar = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const monthStart = `${year}-${month}-01`;
      const monthEnd = `${year}-${month}-31`;
      const { data: records, error } = await supabase
        .from('attendance')
        .select('id, clock_in_time')
        .eq('user_id', userId)
        .gte('clock_in_time', monthStart)
        .lte('clock_in_time', monthEnd);
      if (error) throw error;
      // Format records for calendar, include time
      const attendanceRecords = (records || []).map(r => ({
        date: r.clock_in_time.slice(0, 10),
        time: r.clock_in_time.slice(11, 19),
        full: r.clock_in_time
      }));
      // Calculate working days
      const daysInMonth = new Date(year, parseInt(month), 0).getDate();
      let workingDays = 0;
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, parseInt(month) - 1, day);
        const dayOfWeek = date.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 4) workingDays++;
      }
      const daysPresent = attendanceRecords.length;
      setAttendanceStats({ daysPresent, daysThisMonth: workingDays, records: attendanceRecords });
      // Check if user has already clocked in today
      const today = new Date().toISOString().slice(0, 10);
      const todayRecord = attendanceRecords.find(record => record.date === today);
      setAlreadyClockedIn(!!todayRecord);
      if (todayRecord) {
        setClockInMessage(`✅ Already clocked in today at ${todayRecord.time}`);
        setStatusIndicator('#4CAF50');
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  /**
   * Request location permissions from the user
   * Required for GPS-based attendance verification
   * 
   * @returns {Promise<boolean>} True if permission granted, false otherwise
   */
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

  /**
   * Get current GPS location with high accuracy
   * Used for office proximity verification
   * 
   * @returns {Promise<Object|null>} Location object or null if failed
   */
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

  /**
   * Main clock-in function with comprehensive error handling
   * Handles the entire clock-in process including:
   * - Permission requests
   * - GPS location acquisition
   * - Server verification
   * - Attendance recording
   * - UI updates
   */
  const handleClockIn = async () => {
    if (alreadyClockedIn) {
      Alert.alert(
        'Already Clocked In',
        'You have already clocked in today.',
        [{ text: 'OK' }]
      );
      return;
    }
    setIsLoading(true);
    setClockInMessage('');
    setLocationStatus('');
    setStatusIndicator('#ffa500');
    try {
      setLocationStatus('Requesting GPS location...');
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        setIsLoading(false);
        return;
      }
      const position = await getGPSLocation();
      if (!position) {
        throw new Error('GPS location is required. Please allow location access.');
      }
      const { coords } = position;
      const userId = await AsyncStorage.getItem('userId');
      // Insert attendance record in Supabase
      const { error } = await supabase
        .from('attendance')
        .insert([{
          user_id: userId,
          location_lat: coords.latitude,
          location_lng: coords.longitude,
          accuracy: coords.accuracy
        }]);
      if (error) throw error;
      setClockInMessage('✅ Clock-in successful!');
      setStatusIndicator('#4CAF50');
      setAlreadyClockedIn(true);
      loadCalendar();
    } catch (error) {
      setClockInMessage('❌ Clock-in failed.');
      setStatusIndicator('#dc2626');
      Alert.alert('Clock-in Failed', error.message || 'Unable to clock in.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user logout with confirmation
   * Clears all stored authentication data and redirects to login
   */
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

  /**
   * Render the attendance calendar for the current month
   * Creates a visual calendar showing present, absent, and non-working days
   * 
   * @returns {JSX.Element|null} Calendar component or null if no data
   */
  const renderCalendar = () => {
    if (!attendanceStats) return null;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const presentDays = new Set(
      attendanceStats.records
        .filter(r => r.date)
        .map(r => Number(r.date.split('-')[2]))
    );
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const firstDay = new Date(year, month, 1).getDay();

    let calendarRows = [];
    
    // Create header row with day names
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

    // Create calendar grid
    let currentRow = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      currentRow.push(<View key={`empty-${i}`} style={styles.calendarCell} />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      // Start new row when we reach the end of a week
      if ((firstDay + day - 1) % 7 === 0 && day !== 1) {
        calendarRows.push(
          <View key={`row-${Math.floor((firstDay + day - 1) / 7)}`} style={styles.calendarRow}>
            {currentRow}
          </View>
        );
        currentRow = [];
      }

      // Determine day type and styling
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const isWorkingDay = dayOfWeek >= 1 && dayOfWeek <= 4; // Monday to Thursday
      const isFriday = dayOfWeek === 5; // Friday
      const presentRecord = attendanceStats.records.find(r => Number(r.date.split('-')[2]) === day);
      const isPresent = !!presentRecord;
      
      // Apply appropriate styling based on day type
      let cellStyle = [styles.calendarCell];
      let textStyle = [styles.calendarCellText];
      
      if (isPresent) {
        cellStyle.push(styles.calendarCellPresent);
        textStyle.push(styles.calendarCellTextPresent);
      } else if (isWorkingDay) {
        cellStyle.push(styles.calendarCellAbsent);
        textStyle.push(styles.calendarCellTextAbsent);
      } else if (isFriday) {
        cellStyle.push(styles.calendarCellFriday);
        textStyle.push(styles.calendarCellTextFriday);
      } else {
        cellStyle.push(styles.calendarCellWeekend);
        textStyle.push(styles.calendarCellTextWeekend);
      }
      
      // Make working days clickable
      const handleDayPress = () => {
        if (isWorkingDay) {
          setSelectedDayInfo({
            date: `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
            time: presentRecord ? presentRecord.time : null,
            isPresent
          });
        }
      };
      currentRow.push(
        <TouchableOpacity key={day} style={cellStyle} onPress={handleDayPress} disabled={!isWorkingDay}>
          <Text style={textStyle}>{day}</Text>
        </TouchableOpacity>
      );
    }

    // Add the final row if it has content
    if (currentRow.length > 0) {
      calendarRows.push(
        <View key="last-row" style={styles.calendarRow}>
          {currentRow}
        </View>
      );
    }

    // Month names for display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    return (
      <View style={styles.calendarContainer}>
        <Text style={styles.monthTitle}>{monthNames[month]} {year}</Text>
        {calendarRows}
        {/* Show time clocked in for selected day below calendar */}
        {selectedDayInfo && (
          <View style={{ marginTop: 12, alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              {selectedDayInfo.date}
            </Text>
            {selectedDayInfo.isPresent && selectedDayInfo.time ? (
              <Text style={{ fontSize: 15, color: '#4CAF50' }}>Clocked in at: {selectedDayInfo.time}</Text>
            ) : (
              <Text style={{ fontSize: 15, color: '#dc2626' }}>Not clocked in</Text>
            )}
          </View>
        )}
        <Text style={styles.statsText}>
          <Text style={styles.bold}>Days Present:</Text> {attendanceStats.daysPresent} / {attendanceStats.daysThisMonth}
        </Text>
      </View>
    );
  };

  /**
   * Main render function
   * Returns the complete dashboard interface
   */
  return (
    <SafeAreaView style={styles.container}>
      {/* Header section with logo, welcome message, and logout button */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../assets/itskylogo.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.welcomeText}>Welcome, {userEmail}!</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Scrollable content area for calendar */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Attendance Calendar (This Month)</Text>
          {renderCalendar()}
        </View>
      </ScrollView>

      {/* Fixed bottom section with clock-in button */}
      <View style={styles.bottomSection}>
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

          {/* Status messages */}
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
      </View>
    </SafeAreaView>
  );
}

/**
 * Component styles
 * Defines the visual appearance of all dashboard elements
 */
const styles = StyleSheet.create({
  // Main container with safe area support
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  // Header section styling
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 15,
  },
  headerLogo: {
    width: 60,
    height: 30,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    flex: 1,
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
  
  // Scrollable content area
  scrollContent: {
    flex: 1,
  },
  
  // Bottom section with clock-in functionality
  bottomSection: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingBottom: 20,
  },
  clockInSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  clockInButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
  buttonClockedIn: {
    backgroundColor: '#4CAF50',
  },
  clockInButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  clockInMessage: {
    marginTop: 8,
    color: '#198754',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  locationStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
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
  
  // Statistics section styling
  statsSection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 16,
    margin: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111',
  },
  
  // Calendar styling
  calendarContainer: {
    marginTop: 8,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
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
  calendarCellAbsent: {
    backgroundColor: '#fef2f2',
    borderWidth: 2,
    borderColor: '#dc2626',
  },
  calendarCellWeekend: {
    backgroundColor: '#f0f0f0',
    opacity: 0.6,
  },
  calendarCellFriday: {
    backgroundColor: '#f5f5f5',
    opacity: 0.7,
  },
  calendarCellText: {
    fontSize: 14,
    color: '#111',
  },
  calendarCellTextPresent: {
    color: '#fff',
    fontWeight: '700',
  },
  calendarCellTextAbsent: {
    color: '#dc2626',
    fontWeight: '600',
  },
  calendarCellTextWeekend: {
    color: '#888',
    fontStyle: 'italic',
  },
  calendarCellTextFriday: {
    color: '#aaa',
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