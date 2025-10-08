import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { apiCall } from '@/src/utils/callAPI';

const { width } = Dimensions.get('window');

interface ComplaintDetail {
  _id: string;
  dealer: string;
  complaintType: string;
  assetDU: string;
  model: string;
  isDUDown: boolean;
  isUPSConnected: boolean;
  isPowerLEDGlowing: boolean;
  shortDescription: string;
  natureOfComplaint: string;
  make: string;
  nozzles: string[];
  totalizerReading: number;
  glowingLEDCount: number;
  status?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function ComplaintDetailPage() {
  const { id } = useLocalSearchParams();
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchComplaintDetail();
    }
  }, [id]);

  const fetchComplaintDetail = async () => {
    try {
      setLoading(true);
      const res = await apiCall<ComplaintDetail>(
        `/dealer/getComplaintbyid/${id}`,
        'GET'
      );

      if (!res.success || !res.data) {
        throw new Error(res.error || 'Failed to fetch complaint details');
      }

      setComplaint(res.data);
    } catch (error) {
      Alert.alert('Error', 'Unable to load complaint details.', [
        { text: 'Go Back', onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
          <Text style={styles.loadingText}>Loading Details...</Text>
        </View>
      </View>
    );
  }

  if (!complaint) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#0f172a', '#1e293b', '#334155']}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Complaint not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#334155']}
        style={StyleSheet.absoluteFillObject}
      />

      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backIconButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={styles.topBarTitle}>Complaint Details</Text>
          <Text style={styles.topBarId}>#{complaint._id.slice(-8).toUpperCase()}</Text>
        </View>
        <View style={styles.topBarRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={getStatusColor(complaint.status)}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.statusHeader}
        >
          <View style={styles.statusHeaderContent}>
            <Text style={styles.statusHeaderLabel}>Status</Text>
            <Text style={styles.statusHeaderValue}>
              {complaint.status?.toUpperCase() || 'PENDING'}
            </Text>
          </View>
          <View style={styles.statusPulse} />
        </LinearGradient>

        <LinearGradient
          colors={['#1e293b', '#334155']}
          style={styles.mainCard}
        >
          <View style={styles.cardSection}>
            <Text style={styles.sectionTitle}>Complaint Type</Text>
            <Text style={styles.mainValue}>{complaint.complaintType}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.cardSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {complaint.shortDescription || 'No description provided'}
            </Text>
          </View>

          {complaint.isDUDown && (
            <>
              <View style={styles.divider} />
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                style={styles.alertBanner}
              >
                <Text style={styles.alertIcon}>⚠️</Text>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>CRITICAL ALERT</Text>
                  <Text style={styles.alertText}>DU is currently down</Text>
                </View>
              </LinearGradient>
            </>
          )}
        </LinearGradient>

        <LinearGradient
          colors={['#1e293b', '#334155']}
          style={styles.infoCard}
        >
          <Text style={styles.cardTitle}>Asset Information</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxLabel}>Dealer</Text>
              <Text style={styles.infoBoxValue}>{complaint.dealer}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxLabel}>Asset DU</Text>
              <Text style={styles.infoBoxValue}>{complaint.assetDU}</Text>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxLabel}>Model</Text>
              <Text style={styles.infoBoxValue}>{complaint.model || 'N/A'}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxLabel}>Make</Text>
              <Text style={styles.infoBoxValue}>{complaint.make || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxLabel}>Nature of Complaint</Text>
            <Text style={styles.infoBoxValue}>{complaint.natureOfComplaint}</Text>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={['#1e293b', '#334155']}
          style={styles.infoCard}
        >
          <Text style={styles.cardTitle}>System Status</Text>

          <View style={styles.statusGrid}>
            <View style={styles.statusItem}>
              <View style={styles.statusIndicator}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: complaint.isDUDown ? '#ef4444' : '#10b981' },
                  ]}
                />
              </View>
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>DU Status</Text>
                <Text style={styles.statusValue}>
                  {complaint.isDUDown ? 'Down' : 'Running'}
                </Text>
              </View>
            </View>

            <View style={styles.statusItem}>
              <View style={styles.statusIndicator}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: complaint.isUPSConnected ? '#10b981' : '#ef4444' },
                  ]}
                />
              </View>
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>UPS Connection</Text>
                <Text style={styles.statusValue}>
                  {complaint.isUPSConnected ? 'Connected' : 'Disconnected'}
                </Text>
              </View>
            </View>

            <View style={styles.statusItem}>
              <View style={styles.statusIndicator}>
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: complaint.isPowerLEDGlowing ? '#10b981' : '#ef4444' },
                  ]}
                />
              </View>
              <View style={styles.statusInfo}>
                <Text style={styles.statusLabel}>Power LED</Text>
                <Text style={styles.statusValue}>
                  {complaint.isPowerLEDGlowing ? 'Glowing' : 'Off'}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {complaint.nozzles && complaint.nozzles.length > 0 && (
          <LinearGradient
            colors={['#1e293b', '#334155']}
            style={styles.infoCard}
          >
            <Text style={styles.cardTitle}>Nozzles</Text>
            <View style={styles.nozzleGrid}>
              {complaint.nozzles.map((nozzle, index) => (
                <LinearGradient
                  key={index}
                  colors={['#3b82f6', '#2563eb']}
                  style={styles.nozzleChip}
                >
                  <Text style={styles.nozzleText}>{nozzle}</Text>
                </LinearGradient>
              ))}
            </View>
          </LinearGradient>
        )}

        <LinearGradient
          colors={['#1e293b', '#334155']}
          style={styles.infoCard}
        >
          <Text style={styles.cardTitle}>Readings</Text>

          <View style={styles.readingGrid}>
            <View style={styles.readingBox}>
              <Text style={styles.readingLabel}>Totalizer Reading</Text>
              <Text style={styles.readingValue}>
                {complaint.totalizerReading?.toLocaleString() || '0'}
              </Text>
              <Text style={styles.readingUnit}>Liters</Text>
            </View>
            <View style={styles.readingBox}>
              <Text style={styles.readingLabel}>Glowing LEDs</Text>
              <Text style={styles.readingValue}>{complaint.glowingLEDCount || '0'}</Text>
              <Text style={styles.readingUnit}>Count</Text>
            </View>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={['#1e293b', '#334155']}
          style={styles.infoCard}
        >
          <Text style={styles.cardTitle}>Timeline</Text>

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineLabel}>Created</Text>
              <Text style={styles.timelineDate}>{formatDate(complaint.createdAt)}</Text>
            </View>
          </View>

          {complaint.updatedAt && complaint.updatedAt !== complaint.createdAt && (
            <View style={styles.timelineItem}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>Last Updated</Text>
                <Text style={styles.timelineDate}>{formatDate(complaint.updatedAt)}</Text>
              </View>
            </View>
          )}
        </LinearGradient>

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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#f1f5f9',
    marginBottom: 20,
    fontWeight: '600',
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#60a5fa',
  },
  backButtonText: {
    color: '#60a5fa',
    fontSize: 16,
    fontWeight: '600',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  backIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  backIcon: {
    fontSize: 20,
    color: '#60a5fa',
    fontWeight: '600',
  },
  topBarCenter: {
    flex: 1,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
    letterSpacing: -0.3,
  },
  topBarId: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '600',
  },
  topBarRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  statusHeader: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  statusHeaderContent: {
    alignItems: 'center',
  },
  statusHeaderLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  statusHeaderValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  statusPulse: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  mainCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
  },
  cardSection: {
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  mainValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
    letterSpacing: -0.5,
  },
  descriptionText: {
    fontSize: 16,
    color: '#cbd5e1',
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    marginVertical: 20,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  alertIcon: {
    fontSize: 24,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  alertText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  infoCard: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  infoBox: {
    flex: 1,
    backgroundColor: 'rgba(51, 65, 85, 0.4)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
  },
  infoBoxLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  infoBoxValue: {
    fontSize: 15,
    color: '#f1f5f9',
    fontWeight: '600',
  },
  statusGrid: {
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(51, 65, 85, 0.4)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
    gap: 12,
  },
  statusIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(51, 65, 85, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 16,
    color: '#f1f5f9',
    fontWeight: '600',
  },
  nozzleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  nozzleChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 90,
  },
  nozzleText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  readingGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  readingBox: {
    flex: 1,
    backgroundColor: 'rgba(51, 65, 85, 0.4)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
    alignItems: 'center',
  },
  readingLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    textAlign: 'center',
  },
  readingValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#60a5fa',
    letterSpacing: -0.5,
  },
  readingUnit: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    marginTop: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#60a5fa',
    borderWidth: 3,
    borderColor: 'rgba(96, 165, 250, 0.3)',
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 15,
    color: '#cbd5e1',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 20,
  },
});
