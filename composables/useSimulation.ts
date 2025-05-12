import { ref, computed, onMounted, watch } from 'vue';
import { useStudentStore } from '../stores/student';
import { useSavingsStore } from '../stores/savings';
import { useUIStore } from '../stores/ui';
import { formatWeek, formatDate } from '../utils/formatters';
import type { StudentId, StudentWithFinancials } from '../types/student';
import type { WeeklyInterest } from '../types/savings';

/**
 * Composable for managing weekly simulation and student withdrawals
 */
export function useSimulation() {
  // Stores
  const studentStore = useStudentStore();
  const savingsStore = useSavingsStore();
  const uiStore = useUIStore();
  
  // State
  const isSimulating = ref<boolean>(false);
  const autoSimulationEnabled = ref<boolean>(false);
  const autoSimulationInterval = ref<number | null>(null);
  const simulationSpeed = ref<number>(1000); // milliseconds
  
  // Computed properties
  const currentWeek = computed<number>(() => savingsStore.getCurrentWeek);
  
  const formattedWeek = computed<string>(() => formatWeek(currentWeek.value));
  
  const weeklyHistory = computed<WeeklyInterest[]>(() => savingsStore.getWeeklyHistory);
  
  const startDate = computed<Date>(() => savingsStore.simulation.startDate);
  
  const lastUpdated = computed<Date>(() => savingsStore.simulation.lastUpdated);
  
  const formattedStartDate = computed<string>(() => formatDate(startDate.value));
  
  const formattedLastUpdated = computed<string>(() => formatDate(lastUpdated.value));
  
  const studentsWithFinancials = computed<StudentWithFinancials[]>(() => 
    studentStore.getStudentsWithFinancials(currentWeek.value)
  );
  
  // Methods
  const advanceWeek = async (): Promise<void> => {
    isSimulating.value = true;
    
    try {
      savingsStore.advanceWeek();
      uiStore.showInfo(`Advanced to ${formatWeek(currentWeek.value)}`);
    } catch (error) {
      uiStore.showError(`Failed to advance week: ${error}`);
    } finally {
      isSimulating.value = false;
    }
  };
  
  const resetSimulation = (): void => {
    // Stop auto simulation if running
    stopAutoSimulation();
    
    savingsStore.resetSimulation();
    uiStore.showInfo('Simulation reset to week 0');
  };
  
  const withdrawStudent = (studentId: StudentId): void => {
    const student = studentStore.getStudentById(studentId);
    
    if (!student) {
      uiStore.showError('Student not found');
      return;
    }
    
    // Confirm withdrawal with modal
    uiStore.openModal('confirmWithdrawal', { 
      studentId, 
      studentName: student.name,
      currentWeek: currentWeek.value
    });
  };
  
  const processWithdrawal = (studentId: StudentId): void => {
    const { success, error, withdrawal } = studentStore.withdrawStudent(studentId, currentWeek.value);
    
    if (success && withdrawal) {
      const student = studentStore.getStudentById(studentId);
      if (student) {
        uiStore.showSuccess(`${student.name} has withdrawn with ${withdrawal.amountWithdrawn.toLocaleString()} Naira`);
      } else {
        uiStore.showSuccess('Student has successfully withdrawn');
      }
      
      // Close any open modals
      uiStore.closeModal();
    } else {
      uiStore.showError(error || 'Failed to process withdrawal');
    }
  };
  
  const startAutoSimulation = (): void => {
    if (autoSimulationInterval.value !== null) return;
    
    autoSimulationEnabled.value = true;
    autoSimulationInterval.value = window.setInterval(() => {
      advanceWeek();
    }, simulationSpeed.value);
    
    uiStore.showInfo('Auto-simulation started');
  };
  
  const stopAutoSimulation = (): void => {
    if (autoSimulationInterval.value === null) return;
    
    clearInterval(autoSimulationInterval.value);
    autoSimulationInterval.value = null;
    autoSimulationEnabled.value = false;
    
    uiStore.showInfo('Auto-simulation stopped');
  };
  
  const toggleAutoSimulation = (): void => {
    if (autoSimulationEnabled.value) {
      stopAutoSimulation();
    } else {
      startAutoSimulation();
    }
  };
  
  const setSimulationSpeed = (speed: number): void => {
    simulationSpeed.value = speed;
    
    // If auto simulation is running, restart it with new speed
    if (autoSimulationEnabled.value) {
      stopAutoSimulation();
      startAutoSimulation();
    }
  };
  
  // Clean up interval on component unmount
  onMounted(() => {
    return () => {
      if (autoSimulationInterval.value !== null) {
        clearInterval(autoSimulationInterval.value);
      }
    };
  });
  
  return {
    // State
    isSimulating,
    autoSimulationEnabled,
    simulationSpeed,
    
    // Computed
    currentWeek,
    formattedWeek,
    weeklyHistory,
    startDate,
    lastUpdated,
    formattedStartDate,
    formattedLastUpdated,
    studentsWithFinancials,
    
    // Methods
    advanceWeek,
    resetSimulation,
    withdrawStudent,
    processWithdrawal,
    startAutoSimulation,
    stopAutoSimulation,
    toggleAutoSimulation,
    setSimulationSpeed
  };
}