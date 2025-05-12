import { ref, computed } from 'vue';
import { useStudentStore } from '../stores/student';
import { useTierStore } from '../stores/tier';
import { useUIStore } from '../stores/ui';
import type { StudentInfo, StudentWithFinancials, StudentRegistrationData, StudentId, StudentStatus } from '../types/student';
import { TierLevel } from '../types/tier';
import { validateStudentRegistration } from '../utils/validators';
import { formatStudentName } from '../utils/formatters';

/**
 * Composable for student management
 */
export function useStudents() {
  // Stores
  const studentStore = useStudentStore();
  const tierStore = useTierStore();
  const uiStore = useUIStore();
  
  // State
  const newStudentName = ref<string>('');
  const selectedTierId = ref<TierLevel | null>(null);
  const amountInput = ref<number>(0);
  const registrationErrors = ref<Record<string, string>>({});
  const isRegistering = ref<boolean>(false);
  
  // Computed properties
  const students = computed<StudentInfo[]>(() => studentStore.getAllStudents);
  
  const activeStudents = computed<StudentInfo[]>(() => studentStore.getActiveStudents);
  
  const withdrawnStudents = computed<StudentInfo[]>(() => studentStore.getWithdrawnStudents);
  
  const studentsWithFinancials = computed<StudentWithFinancials[]>(() => {
    // Get current week from savings store or pass 0 if not available
    const currentWeek = 0; // Will be updated when useSavings is implemented
    return studentStore.getStudentsWithFinancials(currentWeek);
  });
  
  const activeStudentCount = computed<number>(() => studentStore.getActiveStudentCount);
  
  const isGroupFull = computed<boolean>(() => studentStore.isGroupFull);
  
  const availableSpots = computed<number>(() => studentStore.getAvailableSpots);
  
  const canRegisterMore = computed<boolean>(() => studentStore.canRegisterMore);
  
  // Form validation computed property
  const isFormValid = computed<boolean>(() => {
    if (!newStudentName.value || newStudentName.value.trim() === '') return false;
    if (selectedTierId.value === null) return false;
    
    const expectedAmount = tierStore.getExpectedAmount(selectedTierId.value);
    return amountInput.value === expectedAmount;
  });
  
  // Methods
  const registerStudent = async (): Promise<StudentInfo | null> => {
    isRegistering.value = true;
    registrationErrors.value = {};
    
    try {
      // Validate form
      if (!isFormValid.value) {
        if (!newStudentName.value || newStudentName.value.trim() === '') {
          registrationErrors.value.name = 'Name is required';
        }
        
        if (selectedTierId.value === null) {
          registrationErrors.value.tierId = 'Please select a tier';
        }
        
        if (selectedTierId.value !== null) {
          const expectedAmount = tierStore.getExpectedAmount(selectedTierId.value);
          if (amountInput.value !== expectedAmount) {
            registrationErrors.value.amount = `Amount must be exactly ₦${expectedAmount.toLocaleString()} for the selected tier`;
          }
        }
        
        return null;
      }
      
      // Check if group is full
      if (isGroupFull.value) {
        registrationErrors.value.general = 'The savings group is full. Please try again when a spot becomes available.';
        return null;
      }
      
      // Prepare registration data
      const registrationData: StudentRegistrationData = {
        name: newStudentName.value.trim(),
        tierId: selectedTierId.value as TierLevel,
        amount: amountInput.value
      };
      
      // Register student
      const { success, error, student } = studentStore.registerStudent(registrationData);
      
      if (success && student) {
        // Show success notification
        uiStore.showSuccess(`${formatStudentName(student.name)} has been successfully registered!`);
        
        // Reset form
        resetForm();
        
        return student;
      } else {
        registrationErrors.value.general = error || 'Failed to register student';
        return null;
      }
    } finally {
      isRegistering.value = false;
    }
  };
  
  const withdrawStudent = (studentId: StudentId, currentWeek: number): void => {
    const { success, error, withdrawal } = studentStore.withdrawStudent(studentId, currentWeek);
    
    if (success && withdrawal) {
      const student = studentStore.getStudentById(studentId);
      if (student) {
        uiStore.showSuccess(`${formatStudentName(student.name)} has withdrawn with ₦${withdrawal.amountWithdrawn.toLocaleString()}`);
      } else {
        uiStore.showSuccess('Student has successfully withdrawn');
      }
    } else {
      uiStore.showError(error || 'Failed to process withdrawal');
    }
  };
  
  const getStudentById = (id: StudentId): StudentInfo | undefined => {
    return studentStore.getStudentById(id);
  };
  
  const resetForm = (): void => {
    newStudentName.value = '';
    selectedTierId.value = null;
    amountInput.value = 0;
    registrationErrors.value = {};
  };
  
  const setTier = (tierId: TierLevel): void => {
    selectedTierId.value = tierId;
    
    // Auto-set the correct amount for the tier
    amountInput.value = tierStore.getExpectedAmount(tierId);
  };
  
  // Initialize with test data if needed (development only)
  const initWithTestData = (): void => {
    studentStore.initializeWithTestData();
  };
  
  return {
    // State
    newStudentName,
    selectedTierId,
    amountInput,
    registrationErrors,
    isRegistering,
    
    // Computed
    students,
    activeStudents,
    withdrawnStudents,
    studentsWithFinancials,
    activeStudentCount,
    isGroupFull,
    availableSpots,
    canRegisterMore,
    isFormValid,
    
    // Methods
    registerStudent,
    withdrawStudent,
    getStudentById,
    resetForm,
    setTier,
    initWithTestData
  };
}