import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Removed: import axios from 'axios';
// Removed: import { getApiUrl } from '../config/api';

export default function AdminDashboardScreen({ navigation }) {
  const [adminEmail, setAdminEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadAdminData();
    loadStats();
  }, []);

  const loadAdminData = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      setAdminEmail(email);
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      // Supabase client or direct fetch for stats
      // For now, a placeholder for future implementation
      // Example: const response = await axios.get(getApiUrl('/admin/stats'), { headers: { Authorization: token } });
      // setStats(response.data);
      setStats({
        stats: [], // Removed example users
        daysThisMonth: 22, // Placeholder for current month days
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      Alert.alert('Error', 'Failed to load attendance statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
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

  const renderUserStats = () => {
    if (!stats || !stats.stats) return null;

    return stats.stats.map((user, index) => (
      <View key={index} style={styles.userCard}>
        <View style={styles.userHeader}>
          <Text style={styles.userName}>{user.fullname || 'Unknown User'}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Days Present</Text>
            <Text style={styles.statValue}>{user.daysPresent}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>This Month</Text>
            <Text style={styles.statValue}>{stats.daysThisMonth}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Attendance Rate</Text>
            <Text style={styles.statValue}>
              {stats.daysThisMonth > 0 
                ? Math.round((user.daysPresent / stats.daysThisMonth) * 100) 
                : 0}%
            </Text>
          </View>
        </View>
        {user.records && user.records.length > 0 && (
          <View style={styles.attendanceDates}>
            <Text style={styles.datesLabel}>Attendance Dates:</Text>
            <Text style={styles.datesText}>
              {user.records.map(record => {
                const date = new Date(record).toLocaleDateString();
                const time = new Date(record).toLocaleTimeString();
                return `${date} ${time}`;
              }).slice(-5).join(', ')}
              {user.records.length > 5 && '...'}
            </Text>
          </View>
        )}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/itskylogo.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.logo}>ITSky</Text>
          <Text style={styles.subtitle}>Admin Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.adminInfo}>
        <Text style={styles.adminText}>Welcome, {adminEmail}</Text>
        <Text style={styles.adminRole}>Administrator</Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>Employee Attendance Statistics</Text>
          <Text style={styles.statsSubtitle}>
            Current Month: {stats?.daysThisMonth || 0} working days
          </Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#dc2626" />
            <Text style={styles.loadingText}>Loading statistics...</Text>
          </View>
        ) : (
          renderUserStats()
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Info', 'User management features coming soon!')}
          >
            <Text style={styles.actionButtonText}>Manage Users</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Info', 'Export features coming soon!')}
          >
            <Text style={styles.actionButtonText}>Export Reports</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white', // Changed from '#dc2626' (red) to white
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogo: {
    width: 40,
    height: 20,
    marginRight: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222', // Changed from 'white' to dark for contrast
  },
  subtitle: {
    fontSize: 14,
    color: '#333', // Changed from 'rgba(255, 255, 255, 0.8)' to dark
    marginTop: 2,
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#222', // Changed from 'white' to dark
    fontSize: 16,
    fontWeight: '600',
  },
  adminInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  adminText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  adminRole: {
    fontSize: 14,
    color: '#dc2626',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  statsHeader: {
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222', // Changed from red to dark
    marginBottom: 4,
  },
  statsSubtitle: {
    fontSize: 14,
    color: '#666', // Use a neutral color
    marginBottom: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userHeader: {
    marginBottom: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  attendanceDates: {
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 12,
  },
  datesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  datesText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  actionsContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  actionButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#222', // Changed from red to dark
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 