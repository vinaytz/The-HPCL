import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from 'react-native';

const BellIcon = () => (
  <View style={styles.customIcon}>
    <View style={styles.bellBody} />
    <View style={styles.bellClapper} />
  </View>
);

const FileTextIcon = () => (
  <View style={styles.customIcon}>
    <View style={styles.fileOutline}>
      <View style={styles.fileLine} />
      <View style={[styles.fileLine, { top: 16 }]} />
      <View style={[styles.fileLine, { top: 22, width: 16 }]} />
    </View>
  </View>
);

const ChecklistIcon = () => (
  <View style={styles.customIcon}>
    <View style={styles.checklistBox}>
      <View style={styles.checkMark} />
    </View>
  </View>
);

const DocumentIcon = () => (
  <View style={styles.customIcon}>
    <View style={styles.documentShape}>
      <View style={styles.documentCorner} />
    </View>
  </View>
);

const CameraIcon = () => (
  <View style={styles.customIcon}>
    <View style={styles.cameraBody}>
      <View style={styles.cameraLens} />
    </View>
  </View>
);

const HomeIcon = ({ active }: { active?: boolean }) => (
  <View style={[styles.navIconContainer, active && styles.navIconActive]}>
    <View style={styles.homeShape} />
  </View>
);

const ClipboardIcon = () => (
  <View style={styles.navIconContainer}>
    <View style={styles.clipboardShape}>
      <View style={styles.clipboardClip} />
    </View>
  </View>
);

const PlusIcon = () => (
  <View style={styles.plusIcon}>
    <View style={styles.plusHorizontal} />
    <View style={styles.plusVertical} />
  </View>
);

const ChartIcon = () => (
  <View style={styles.navIconContainer}>
    <View style={styles.chartContainer}>
      <View style={[styles.chartBar, { height: 12 }]} />
      <View style={[styles.chartBar, { height: 18 }]} />
      <View style={[styles.chartBar, { height: 8 }]} />
    </View>
  </View>
);

const UserIcon = () => (
  <View style={styles.navIconContainer}>
    <View style={styles.userHead} />
    <View style={styles.userBody} />
  </View>
);

const ShieldIcon = () => (
  <View style={styles.shieldContainer}>
    <View style={styles.shieldShape}>
      <View style={styles.shieldInner} />
    </View>
  </View>
);

const AlertTriangleIcon = () => (
  <View style={styles.alertContainer}>
    <View style={styles.alertTriangle}>
      <Text style={styles.alertExclamation}>!</Text>
    </View>
  </View>
);

export default function DealerDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const [userData] = useState({
    name: 'Rajesh Kumar',
    retailOutletId: 'RO-BTI-001',
    // salesArea: 'Bathinda Sales Area',
    // userType: 
  });

  const [stats] = useState({
    activeComplaints: 5,
    pendingApprovals: 2,
    completedToday: 3,
    totalThisMonth: 18,
  });

  const [recentComplaints] = useState([
    {
      id: 'C001',
      type: 'Electrical',
      status: 'in_progress',
      assignedTo: 'Vendor A',
      createdAt: '2 hours ago',
      priority: 'high',
    },
    {
      id: 'C002',
      type: 'Civil',
      status: 'pending',
      assignedTo: 'Not assigned',
      createdAt: '5 hours ago',
      priority: 'medium',
    },
    {
      id: 'C003',
      type: 'Hoarding Board',
      status: 'completed',
      assignedTo: 'Vendor B',
      createdAt: '1 day ago',
      priority: 'low',
    },
  ]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'in_progress':
        return '#0891b2';
      case 'pending':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#dc2626';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#64748b';
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome Back,</Text>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.outletId}>{userData.retailOutletId}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
          <BellIcon />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <FileTextIcon />
              </View>
              <Text style={styles.actionLabel}>Log Complaint</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <ChecklistIcon />
              </View>
              <Text style={styles.actionLabel}>Safety Checklist</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <DocumentIcon />
              </View>
              <Text style={styles.actionLabel}>Work Permit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <CameraIcon />
              </View>
              <Text style={styles.actionLabel}>Upload Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, styles.statCardActive]}>
              <Text style={styles.statNumber}>{stats.activeComplaints}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>

            <View style={[styles.statCard, styles.statCardPending]}>
              <Text style={styles.statNumber}>{stats.pendingApprovals}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>

            <View style={[styles.statCard, styles.statCardCompleted]}>
              <Text style={styles.statNumber}>{stats.completedToday}</Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>

            <View style={[styles.statCard, styles.statCardMonth]}>
              <Text style={styles.statNumber}>{stats.totalThisMonth}</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Complaints</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllButton}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentComplaints.map((complaint) => (
            <TouchableOpacity key={complaint.id} style={styles.complaintCard}>
              <View style={styles.complaintHeader}>
                <View style={styles.complaintIdContainer}>
                  <Text style={styles.complaintId}>{complaint.id}</Text>
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: getPriorityColor(complaint.priority) },
                    ]}
                  >
                    <Text style={styles.priorityText}>
                      {complaint.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(complaint.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {complaint.status.replace('_', ' ').toUpperCase()}
                  </Text>
                </View>
              </View>

              <View style={styles.complaintBody}>
                <View style={styles.complaintRow}>
                  <Text style={styles.complaintLabel}>Type:</Text>
                  <Text style={styles.complaintValue}>{complaint.type}</Text>
                </View>
                <View style={styles.complaintRow}>
                  <Text style={styles.complaintLabel}>Assigned To:</Text>
                  <Text style={styles.complaintValue}>
                    {complaint.assignedTo}
                  </Text>
                </View>
                <View style={styles.complaintRow}>
                  <Text style={styles.complaintLabel}>Created:</Text>
                  <Text style={styles.complaintValue}>
                    {complaint.createdAt}
                  </Text>
                </View>
              </View>

              <View style={styles.complaintFooter}>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Work Authorizations</Text>
          <TouchableOpacity style={styles.authCard}>
            <View style={styles.authHeader}>
              <ShieldIcon />
              <View style={styles.authContent}>
                <Text style={styles.authTitle}>
                  Work Start Authorization Required
                </Text>
                <Text style={styles.authSubtitle}>
                  Complaint ID: C001 • Electrical Work
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.authButton}>
              <Text style={styles.authButtonText}>Authorize with OTP</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.safetyNotice}>
            <AlertTriangleIcon />
            <View style={styles.safetyContent}>
              <Text style={styles.safetyTitle}>Safety First!</Text>
              <Text style={styles.safetyText}>
                Ensure all safety protocols are followed before authorizing any work.
                Work permit must be uploaded.
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <HomeIcon active />
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={()=>{router.push("./dashboard/allComplaint")}} >
          <ClipboardIcon />
          <Text style={styles.navLabel}>Complaints</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.fabButton} onPress={()=>{router.push("./dashboard/complaint-logging")}}>
          <PlusIcon />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <ChartIcon />
          <Text style={styles.navLabel}>Reports</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <UserIcon />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    backgroundColor: '#0f172a',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  greeting: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  outletId: {
    fontSize: 13,
    color: '#06b6d4',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  customIcon: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellBody: {
    width: 20,
    height: 18,
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: '#06b6d4',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  bellClapper: {
    width: 6,
    height: 6,
    backgroundColor: '#06b6d4',
    borderRadius: 3,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  seeAllButton: {
    fontSize: 14,
    color: '#0891b2',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0891b2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#0891b2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  fileOutline: {
    width: 22,
    height: 28,
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: '#ffffff',
    borderRadius: 4,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileLine: {
    position: 'absolute',
    width: 12,
    height: 2,
    backgroundColor: '#ffffff',
    borderRadius: 1,
    top: 10,
  },
  checklistBox: {
    width: 24,
    height: 24,
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: '#ffffff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    width: 12,
    height: 6,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: '#ffffff',
    transform: [{ rotate: '-45deg' }],
    marginTop: -2,
  },
  documentShape: {
    width: 22,
    height: 28,
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: '#ffffff',
    borderRadius: 4,
    position: 'relative',
  },
  documentCorner: {
    position: 'absolute',
    top: -2.5,
    right: -2.5,
    width: 8,
    height: 8,
    backgroundColor: '#0891b2',
    borderTopRightRadius: 4,
  },
  cameraBody: {
    width: 28,
    height: 22,
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: '#ffffff',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraLens: {
    width: 12,
    height: 12,
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: '#ffffff',
    borderRadius: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  statCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
  },
  statCardActive: {
    backgroundColor: '#0891b2',
    borderColor: '#06b6d4',
  },
  statCardPending: {
    backgroundColor: '#f59e0b',
    borderColor: '#fbbf24',
  },
  statCardCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#34d399',
  },
  statCardMonth: {
    backgroundColor: '#6366f1',
    borderColor: '#818cf8',
  },
  statNumber: {
    fontSize: 40,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  complaintCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  complaintHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  complaintIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  complaintId: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 0.3,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  complaintBody: {
    marginBottom: 14,
  },
  complaintRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  complaintLabel: {
    fontSize: 13,
    color: '#64748b',
    width: 100,
    fontWeight: '600',
  },
  complaintValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  complaintFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 14,
  },
  viewButton: {
    backgroundColor: '#0891b2',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#0891b2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  authCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderLeftWidth: 5,
    borderLeftColor: '#f59e0b',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  authHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  authContent: {
    flex: 1,
  },
  authTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  authSubtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  authButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  authButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  shieldContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  shieldShape: {
    width: 24,
    height: 28,
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: '#f59e0b',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldInner: {
    width: 10,
    height: 12,
    backgroundColor: '#f59e0b',
    borderRadius: 2,
  },
  safetyNotice: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  alertContainer: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 14,
    borderRightWidth: 14,
    borderBottomWidth: 24,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#f59e0b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertExclamation: {
    position: 'absolute',
    bottom: 4,
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  safetyContent: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#78350f',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  safetyText: {
    fontSize: 13,
    color: '#78350f',
    lineHeight: 20,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 12,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navIconContainer: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    opacity: 0.5,
  },
  navIconActive: {
    opacity: 1,
  },
  homeShape: {
    width: 22,
    height: 20,
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: '#0891b2',
    borderBottomWidth: 2.5,
    borderTopWidth: 0,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  clipboardShape: {
    width: 18,
    height: 22,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#64748b',
    borderRadius: 3,
    position: 'relative',
  },
  clipboardClip: {
    position: 'absolute',
    top: -3,
    left: 4,
    width: 6,
    height: 6,
    backgroundColor: '#64748b',
    borderRadius: 2,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
  },
  chartBar: {
    width: 5,
    backgroundColor: '#64748b',
    borderRadius: 2,
  },
  userHead: {
    width: 12,
    height: 12,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#64748b',
    borderRadius: 6,
    marginBottom: 2,
  },
  userBody: {
    width: 18,
    height: 10,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#64748b',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  navLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  navLabelActive: {
    fontSize: 11,
    color: '#0891b2',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  fabButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0891b2',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    shadowColor: '#0891b2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  plusIcon: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusHorizontal: {
    position: 'absolute',
    width: 20,
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  plusVertical: {
    position: 'absolute',
    width: 3,
    height: 20,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
});
