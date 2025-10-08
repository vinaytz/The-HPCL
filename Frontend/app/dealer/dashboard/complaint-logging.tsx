import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  ActivityIndicator,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { SquareCheck as CheckSquare, Square, X } from 'lucide-react-native';
import { apiCall } from '@/src/utils/callAPI';
import { router } from 'expo-router';

interface FormOptions {
  dealers: string[];
  complaintType: string[];
  assetDU: string[];
  natureOfComplaint: string[];
}

interface ComplaintFormData {
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
  totalizerReading: string;
  glowingLEDCount: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const NOZZLE_OPTIONS = ['Nozzle 1', 'Nozzle 2', 'Nozzle 3', 'Nozzle 4'];


export default function ComplaintSubmissionPage() {
  const [formOptions, setFormOptions] = useState<FormOptions>({
    dealers: [],
    complaintType: [],
    assetDU: [],
    natureOfComplaint: [],
  });
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showNozzleModal, setShowNozzleModal] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const [formData, setFormData] = useState<ComplaintFormData>({
    dealer: 'BHULLAR FILLING STATION',
    complaintType: '',
    assetDU: '',
    model: '',
    isDUDown: false,
    isUPSConnected: false,
    isPowerLEDGlowing: false,
    shortDescription: '',
    natureOfComplaint: '',
    make: '',
    nozzles: [],
    totalizerReading: '',
    glowingLEDCount: '',
  });

  useEffect(() => {
    fetchFormOptions();
  }, []);

 const fetchFormOptions = async () => {
  try {
    setLoadingOptions(true);
    const res = await apiCall<FormOptions>("/dealer/getFormOptions", "GET");

    if (!res.success || !res.data) throw new Error(res.error || "Failed to fetch form options");

    setFormOptions(res.data);
  } catch (error) {
    Alert.alert(
      "Error Loading Form",
      "Unable to load form options. Please check your connection and try again.",
      [
        { text: "Retry", onPress: () => fetchFormOptions() },
        { text: "Cancel", style: "cancel" },
      ]
    );
  } finally {
    setLoadingOptions(false);
  }
};

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // if (!formData.dealer) {
    //   newErrors.dealer = 'Please select a dealer';
    // }
    if (!formData.complaintType) {
      newErrors.complaintType = 'Please select a complaint type';
    }
    if (!formData.assetDU) {
      newErrors.assetDU = 'Please select an asset DU';
    }
    if (!formData.natureOfComplaint) {
      newErrors.natureOfComplaint = 'Please select nature of complaint';
    }
    if (formData.shortDescription.length > 250) {
      newErrors.shortDescription = 'Description must not exceed 250 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 
const handleSubmit = async () => {
  if (!validateForm()) {
    Alert.alert("Validation Error", "Please fill in all required fields correctly");
    return;
    }

  try {
    setSubmitting(true);

    const payload = {
      ...formData,
      totalizerReading: parseFloat(formData.totalizerReading) || 0,
      glowingLEDCount: parseInt(formData.glowingLEDCount) || 0,
    };

    const res = await apiCall("/dealer/createComplaint", "POST", payload);
    if (!res.success) throw new Error(res.error || "Failed to submit complaint");
    
    Alert.alert("Success", "Complaint submitted successfully!", [
      { text: "OK", onPress: () => resetForm() },
    ]);
    return  router.replace("/dealer/dashboard");
  } catch (error) {
    Alert.alert("Submission Failed", "Unable to submit complaint. Please try again.", [
      { text: "OK", style: "cancel" },
    ]);
  } finally {
    setSubmitting(false);
  }
};
  const resetForm = () => {
    setFormData({
      dealer: '',
      complaintType: '',
      assetDU: '',
      model: '',
      isDUDown: false,
      isUPSConnected: false,
      isPowerLEDGlowing: false,
      shortDescription: '',
      natureOfComplaint: '',
      make: '',
      nozzles: [],
      totalizerReading: '',
      glowingLEDCount: '',
    });
    setErrors({});
  };

  const toggleNozzle = (nozzle: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setFormData(prev => ({
      ...prev,
      nozzles: prev.nozzles.includes(nozzle)
        ? prev.nozzles.filter(n => n !== nozzle)
        : [...prev.nozzles, nozzle],
    }));
  };

  const handleToggleSwitch = (field: 'isDUDown' | 'isUPSConnected' | 'isPowerLEDGlowing', value: boolean) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loadingOptions) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading form options...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>Submit Complaint</Text>
            <Text style={styles.subtitle}>Fill in the details below</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>
              Dealer
            </Text>
            <View style={styles.input}>
              <Text style={{ fontSize: 16, color: '#111827' }}>BHULLAR FILLING STATION</Text>
            </View>

            {errors.dealer && <Text style={styles.errorText}>{errors.dealer}</Text>}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>
              Complaint Type <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.pickerContainer, errors.complaintType && styles.inputError]}>
              <Picker
                selectedValue={formData.complaintType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, complaintType: value }))}
                style={styles.picker}
              >
                <Picker.Item label="Select complaint type..." value="" />
                {(formOptions.complaintType || []).map((type, index) => (
  <Picker.Item key={index} label={type} value={type} />
))}
              </Picker>
            </View>
            {errors.complaintType && <Text style={styles.errorText}>{errors.complaintType}</Text>}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>
              Asset DU <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.pickerContainer, errors.assetDU && styles.inputError]}>
              <Picker
                selectedValue={formData.assetDU}
                onValueChange={(value) => setFormData(prev => ({ ...prev, assetDU: value }))}
                style={styles.picker}
              >
                <Picker.Item label="Select asset DU..." value="" />
                {(formOptions.assetDU || []).map((asset, index) => (
  <Picker.Item key={index} label={asset} value={asset} />
))}
              </Picker>
            </View>
            {errors.assetDU && <Text style={styles.errorText}>{errors.assetDU}</Text>}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Model</Text>
            <TextInput
              style={styles.input}
              value={formData.model}
              onChangeText={(value) => setFormData(prev => ({ ...prev, model: value }))}
              placeholder="Enter model"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Status Indicators</Text>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Is DU Down</Text>
              <Switch
                value={formData.isDUDown}
                onValueChange={(value) => handleToggleSwitch('isDUDown', value)}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={formData.isDUDown ? '#2563eb' : '#f3f4f6'}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Is UPS Connected</Text>
              <Switch
                value={formData.isUPSConnected}
                onValueChange={(value) => handleToggleSwitch('isUPSConnected', value)}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={formData.isUPSConnected ? '#2563eb' : '#f3f4f6'}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Is Power LED Glowing</Text>
              <Switch
                value={formData.isPowerLEDGlowing}
                onValueChange={(value) => handleToggleSwitch('isPowerLEDGlowing', value)}
                trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
                thumbColor={formData.isPowerLEDGlowing ? '#2563eb' : '#f3f4f6'}
              />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>
              Short Description <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.textArea, errors.shortDescription && styles.inputError]}
              value={formData.shortDescription}
              onChangeText={(value) => setFormData(prev => ({ ...prev, shortDescription: value }))}
              placeholder="Describe the issue..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              maxLength={250}
            />
            <Text style={styles.charCount}>
              {formData.shortDescription.length}/250 characters
            </Text>
            {errors.shortDescription && <Text style={styles.errorText}>{errors.shortDescription}</Text>}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>
              Nature of Complaint <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.pickerContainer, errors.natureOfComplaint && styles.inputError]}>
              <Picker
                selectedValue={formData.natureOfComplaint}
                onValueChange={(value) => setFormData(prev => ({ ...prev, natureOfComplaint: value }))}
                style={styles.picker}
              >
                <Picker.Item label="Select nature..." value="" />
             {(formOptions.natureOfComplaint || []).map((nature, index) => (
  <Picker.Item key={index} label={nature} value={nature} />
))}
              </Picker>
            </View>
            {errors.natureOfComplaint && <Text style={styles.errorText}>{errors.natureOfComplaint}</Text>}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Make</Text>
            <TextInput
              style={styles.input}
              value={formData.make}
              onChangeText={(value) => setFormData(prev => ({ ...prev, make: value }))}
              placeholder="Enter make"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Nozzles</Text>
            <TouchableOpacity
              style={styles.multiSelectButton}
              onPress={() => setShowNozzleModal(true)}
            >
              <Text style={styles.multiSelectButtonText}>
                {formData.nozzles.length > 0
                  ? `${formData.nozzles.length} selected`
                  : 'Select nozzles...'}
              </Text>
            </TouchableOpacity>
            {formData.nozzles.length > 0 && (
              <View style={styles.chipContainer}>
                {formData.nozzles.map((nozzle, index) => (
                  <View key={index} style={styles.chip}>
                    <Text style={styles.chipText}>{nozzle}</Text>
                    <TouchableOpacity onPress={() => toggleNozzle(nozzle)}>
                      <X size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Totalizer Reading</Text>
            <TextInput
              style={styles.input}
              value={formData.totalizerReading}
              onChangeText={(value) => setFormData(prev => ({ ...prev, totalizerReading: value }))}
              placeholder="Enter reading"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Glowing LED Count</Text>
            <TextInput
              style={styles.input}
              value={formData.glowingLEDCount}
              onChangeText={(value) => setFormData(prev => ({ ...prev, glowingLEDCount: value }))}
              placeholder="Enter count"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.submitButtonText}>Submitting...</Text>
              </>
            ) : (
              <Text style={styles.submitButtonText}>Submit Complaint</Text>
            )}
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={showNozzleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNozzleModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowNozzleModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Nozzles</Text>
              <TouchableOpacity onPress={() => setShowNozzleModal(false)}>
                <X size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              {NOZZLE_OPTIONS.map((nozzle, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.checkboxRow}
                  onPress={() => toggleNozzle(nozzle)}
                >
                  {formData.nozzles.includes(nozzle) ? (
                    <CheckSquare size={24} color="#2563eb" />
                  ) : (
                    <Square size={24} color="#9ca3af" />
                  )}
                  <Text style={styles.checkboxLabel}>{nozzle}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowNozzleModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Done</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 13,
    marginTop: 4,
  },
  charCount: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  switchLabel: {
    fontSize: 15,
    color: '#374151',
  },
  multiSelectButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#f9fafb',
  },
  multiSelectButtonText: {
    fontSize: 16,
    color: '#6b7280',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  chipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  bottomSpacing: {
    height: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '85%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalBody: {
    padding: 20,
    maxHeight: 300,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#374151',
  },
  modalCloseButton: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
});
