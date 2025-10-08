import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { apiCall } from '@/src/utils/callAPI';

const { width } = Dimensions.get('window');

interface Complaint {
  _id: string;
  dealer: string;
  complaintType: string;
  assetDU: string;
  model: string;
  isDUDown: boolean;
  shortDescription: string;
  natureOfComplaint: string;
  status?: string;
  createdAt: string;
}

export default function AllComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await apiCall<Complaint[]>('/dealer/getComplaints', 'GET');

      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to fetch complaints');
      }

      setComplaints(res.data || []);
    } catch (error) {
      Alert.alert('Error', 'Unable to load complaints. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchComplaints();
    setRefreshing(false);
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return ['#10b981', '#059669'];
      case 'in_progress':
        return ['#f59e0b', '#d97706'];
      case 'pending':
      default:
        return ['#3b82f6', '#2563eb'];
    }
  };

  const getPriorityBadge = (isDUDown: boolean) => {
    return isDUDown ? {
      label: 'CRITICAL',
      colors: ['#ef4444', '#dc2626']
    } : {
      label: 'NORMAL',
      colors: ['#6366f1', '#4f46e5']
    };
  };

  const filteredComplaints = complaints.filter(complaint => {
    if (filter === 'all') return true;
    if (filter === 'pending') return !complaint.status || complaint.status === 'pending';
    if (filter === 'resolved') return complaint.status === 'resolved';
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 24) {
      return diffHours === 0 ? 'Just now' : `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={['#0f172a', '#1e293b', '#334155']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#60a5fa" />
          <Text style={styles.loadingText}>Loading Complaints...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Complaints</Text>
            <Text style={styles.headerSubtitle}>
              {filteredComplaints.length} {filteredComplaints.length === 1 ? 'ticket' : 'tickets'}
            </Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>{complaints.length}</Text>
            <Text style={styles.statsLabel}>Total</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'pending' && styles.filterButtonActive]}
            onPress={() => setFilter('pending')}
          >
            <Text style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'resolved' && styles.filterButtonActive]}
            onPress={() => setFilter('resolved')}
          >
            <Text style={[styles.filterText, filter === 'resolved' && styles.filterTextActive]}>
              Resolved
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#60a5fa"
            colors={['#60a5fa']}
          />
        }
      >
        {filteredComplaints.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>📋</Text>
            </View>
            <Text style={styles.emptyTitle}>No complaints found</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'all'
                ? "You haven't submitted any complaints yet"
                : `No ${filter} complaints at the moment`}
            </Text>
          </View>
        ) : (
          filteredComplaints.map((complaint, index) => {
            const priority = getPriorityBadge(complaint.isDUDown);
            return (
              <TouchableOpacity
                key={complaint._id}
                onPress={() => router.push(`./complaint/${complaint._id}`)}
                activeOpacity={0.7}
                style={styles.cardWrapper}
              >
                <LinearGradient
                  colors={['#1e293b', '#334155']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.complaintCard}
                >
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <LinearGradient
                        colors={priority.colors}
                        style={styles.priorityBadge}
                      >
                        <Text style={styles.priorityText}>{priority.label}</Text>
                      </LinearGradient>
                      <Text style={styles.timeText}>{formatDate(complaint.createdAt)}</Text>
                    </View>
                    <View style={styles.idBadge}>
                      <Text style={styles.idText}>#{complaint._id.slice(-6).toUpperCase()}</Text>
                    </View>
                  </View>

                  <View style={styles.cardBody}>
                    <Text style={styles.complaintType} numberOfLines={1}>
                      {complaint.complaintType}
                    </Text>
                    <Text style={styles.description} numberOfLines={2}>
                      {complaint.shortDescription || 'No description provided'}
                    </Text>
                  </View>

                  <View style={styles.cardDivider} />

                  <View style={styles.cardFooter}>
                    <View style={styles.infoRow}>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Asset</Text>
                        <Text style={styles.infoValue} numberOfLines={1}>
                          {complaint.assetDU}
                        </Text>
                      </View>
                      <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>Nature</Text>
                        <Text style={styles.infoValue} numberOfLines={1}>
                          {complaint.natureOfComplaint}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.actionRow}>
                      <LinearGradient
                        colors={getStatusColor(complaint.status)}
                        style={styles.statusBadge}
                      >
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>
                          {complaint.status?.toUpperCase() || 'PENDING'}
                        </Text>
                      </LinearGradient>
                      <View style={styles.arrowButton}>
                        <Text style={styles.arrowText}>→</Text>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.glowLine, { opacity: 0.3 + (index % 3) * 0.2 }]} />
                </LinearGradient>
              </TouchableOpacity>
            );
          })
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '500',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
    alignItems: 'center',
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#60a5fa',
  },
  statsLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterContainer: {
    flexGrow: 0,
  },
  filterContent: {
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    borderColor: '#60a5fa',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  filterTextActive: {
    color: '#60a5fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 8,
  },
  cardWrapper: {
    marginBottom: 16,
  },
  complaintCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  timeText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  idBadge: {
    backgroundColor: 'rgba(96, 165, 250, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
  },
  idText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#60a5fa',
    letterSpacing: 0.5,
  },
  cardBody: {
    marginBottom: 16,
  },
  complaintType: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    marginBottom: 16,
  },
  cardFooter: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#cbd5e1',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(96, 165, 250, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 20,
    color: '#60a5fa',
    fontWeight: '600',
  },
  glowLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#60a5fa',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  emptyIconText: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});
