const fs = require('fs');
const path = require('path');

// Directory structure
const structure = {
  'app/(auth)': ['login.tsx', 'forgot-password.tsx', 'otp-verification.tsx'],
  'app/(admin)': ['_layout.tsx', 'dashboard.tsx', 'user-management.tsx', 'reports.tsx', 'settings.tsx'],
  'app/(re-officer)': ['_layout.tsx', 'dashboard.tsx', 'complaint-assignment.tsx', 'map-view.tsx', 'vendor-tracking.tsx', 'safety-checklist.tsx', 'work-permit-upload.tsx', 'estimate-approval.tsx', 'reports.tsx'],
  'app/(sales-officer)': ['_layout.tsx', 'dashboard.tsx', 'complaint-log.tsx', 'priority-setting.tsx', 'exception-reports.tsx', 'photo-upload.tsx'],
  'app/(dealer)': ['_layout.tsx', 'dashboard.tsx', 'complaint-logging.tsx', 'safety-checklist.tsx', 'work-permit-upload.tsx', 'work-authorization.tsx', 'photo-upload.tsx', 'work-completion-auth.tsx'],
  'app/(vendor)': ['_layout.tsx', 'dashboard.tsx', 'active-complaints.tsx', 'safety-checklist.tsx', 'work-permit-upload.tsx', 'work-start-request.tsx', 'work-completion-request.tsx', 'photo-upload.tsx', 'online-estimation.tsx'],
  
  'src/components/common': ['Button.tsx', 'Input.tsx', 'Card.tsx', 'Modal.tsx', 'Loader.tsx', 'ErrorBoundary.tsx', 'PermissionHandler.tsx'],
  'src/components/forms': ['ComplaintForm.tsx', 'SafetyChecklistForm.tsx', 'WorkPermitForm.tsx', 'HoardingComplaintForm.tsx'],
  'src/components/upload': ['ImageUploader.tsx', 'DocumentUploader.tsx', 'CameraCapture.tsx'],
  'src/components/map': ['MapView.tsx', 'RetailOutletMarker.tsx', 'VendorMarker.tsx', 'WorkLocationMarker.tsx'],
  'src/components/dashboard': ['StatsCard.tsx', 'ComplaintList.tsx', 'PendingTasks.tsx', 'RecentActivity.tsx'],
  'src/components/otp': ['OTPInput.tsx', 'OTPVerification.tsx'],
  
  'src/features/auth/hooks': ['useAuth.ts', 'useRoleAccess.ts'],
  'src/features/auth/services': ['authService.ts'],
  'src/features/auth/types': ['auth.types.ts'],
  
  'src/features/complaints/hooks': ['useComplaints.ts', 'useComplaintLog.ts', 'useComplaintAssignment.ts'],
  'src/features/complaints/services': ['complaintService.ts'],
  'src/features/complaints/types': ['complaint.types.ts'],
  'src/features/complaints/constants': ['complaintTypes.ts'],
  
  'src/features/work-permits/hooks': ['useWorkPermit.ts', 'usePermitUpload.ts'],
  'src/features/work-permits/services': ['workPermitService.ts'],
  'src/features/work-permits/types': ['workPermit.types.ts'],
  
  'src/features/safety-checklist/hooks': ['useSafetyChecklist.ts'],
  'src/features/safety-checklist/services': ['safetyService.ts'],
  'src/features/safety-checklist/types': ['safety.types.ts'],
  
  'src/features/otp/hooks': ['useOTP.ts', 'useWorkAuthorization.ts'],
  'src/features/otp/services': ['otpService.ts'],
  'src/features/otp/types': ['otp.types.ts'],
  
  'src/features/location/hooks': ['useLocation.ts', 'useRetailOutlets.ts', 'useVendorTracking.ts'],
  'src/features/location/services': ['locationService.ts'],
  'src/features/location/types': ['location.types.ts'],
  
  'src/features/reports/hooks': ['useReports.ts'],
  'src/features/reports/services': ['reportService.ts'],
  'src/features/reports/types': ['report.types.ts'],
  
  'src/features/uploads/hooks': ['useImageUpload.ts', 'useGPSTagging.ts'],
  'src/features/uploads/services': ['uploadService.ts'],
  'src/features/uploads/types': ['upload.types.ts'],
  
  'src/navigation': ['RoleBasedNavigator.tsx', 'navigationTypes.ts'],
  
  'src/store': ['AuthContext.tsx', 'ComplaintContext.tsx', 'LocationContext.tsx', 'AppContext.tsx'],
  
  'src/services/api': ['apiClient.ts', 'endpoints.ts', 'interceptors.ts'],
  'src/services/storage': ['secureStorage.ts'],
  
  'src/utils': ['validation.ts', 'formatting.ts', 'dateHelpers.ts', 'permissions.ts', 'gpsHelpers.ts', 'roleHelpers.ts'],
  
  'src/constants': ['roles.ts', 'salesAreas.ts', 'regions.ts', 'complaintTypes.ts', 'config.ts'],
  
  'src/theme': ['colors.ts', 'typography.ts', 'spacing.ts', 'theme.ts'],
  
  'src/types': ['user.types.ts', 'retailOutlet.types.ts', 'vendor.types.ts', 'global.types.ts'],
  
  'src/hooks': ['usePermissions.ts', 'useNetworkStatus.ts', 'useAppState.ts'],
  
  'assets/images': ['.gitkeep'],
  'assets/icons': ['.gitkeep'],
  'assets/fonts': ['.gitkeep']
};

// Template content for common files
const templates = {
  '.gitkeep': '',
  
  '_layout.tsx': `import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack />;
}
`,

  'Button.tsx': `import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function Button({ title, onPress, loading, disabled }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#ccc',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
`,

  'apiClient.ts': `import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiry
      await SecureStore.deleteItemAsync('authToken');
      // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default apiClient;
`,

  'roles.ts': `export enum UserRole {
  ADMIN = 'admin',
  RE_OFFICER = 're_officer',
  SALES_OFFICER = 'sales_officer',
  DEALER = 'dealer',
  VENDOR = 'vendor',
}

export const ROLE_NAMES = {
  [UserRole.ADMIN]: 'Admin',
  [UserRole.RE_OFFICER]: 'RE Officer',
  [UserRole.SALES_OFFICER]: 'Sales Officer',
  [UserRole.DEALER]: 'Dealer',
  [UserRole.VENDOR]: 'Vendor',
};
`,

  'AuthContext.tsx': `import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (token) {
        // Fetch user data from API
        // setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // Implement login logic
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
`,
};

// Function to create directories and files
function createStructure() {
  console.log('🚀 Creating project structure...\n');

  Object.entries(structure).forEach(([dir, files]) => {
    const dirPath = path.join(process.cwd(), dir);
    
    // Create directory
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Created: ${dir}/`);
    }

    // Create files
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      
      if (!fs.existsSync(filePath)) {
        // Use template if available, otherwise create empty file
        const template = templates[file] || templates[path.extname(file)] || `// ${file}\n`;
        fs.writeFileSync(filePath, template);
        console.log(`   📄 Created: ${file}`);
      }
    });
  });

  // Create .env.example
  const envExample = `# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# App Configuration
EXPO_PUBLIC_APP_NAME=HPCL TechConnect
`;
  
  if (!fs.existsSync('.env.example')) {
    fs.writeFileSync('.env.example', envExample);
    console.log('\n✅ Created: .env.example');
  }

  console.log('\n✨ Project structure created successfully!\n');
  console.log('📝 Next steps:');
  console.log('1. Copy .env.example to .env and update values');
  console.log('2. Run: npm install');
  console.log('3. Start development: npx expo start\n');
}

// Run the script
createStructure();