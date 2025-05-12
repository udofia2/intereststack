import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import {
  type StudentId,
  type StudentInfo,
  StudentStatus,
  type StudentWithFinancials,
  type StudentRegistrationData,
  type StudentWithdrawal,
} from "../types/student";
import { TierLevel } from "../types/tier";
import { useTierStore } from "./tier";
import {
  calculateWeeklyInterest,
  calculateAccumulatedInterest,
} from "../utils/calculations";
import {
  validateStudentRegistration,
  validateTierAmount,
} from "../utils/validators";

interface StudentState {
  students: StudentInfo[];
  maxStudents: number;
  currentRegistrationData: StudentRegistrationData | null;
}

export const useStudentStore = defineStore("student", {
  state: (): StudentState => ({
    students: [],
    maxStudents: 12, // As per requirements
    currentRegistrationData: null,
  }),

  getters: {
    /**
     * Get all students
     */
    getAllStudents: (state) => state.students,

    /**
     * Get active students
     */
    getActiveStudents: (state) =>
      state.students.filter(
        (student) => student.status === StudentStatus.ACTIVE
      ),

    /**
     * Get withdrawn students
     */
    getWithdrawnStudents: (state) =>
      state.students.filter(
        (student) => student.status === StudentStatus.WITHDRAWN
      ),

    /**
     * Get student by ID
     */
    getStudentById:
      (state) =>
      (id: StudentId): StudentInfo | undefined => {
        return state.students.find((student) => student.id === id);
      },

    /**
     * Get count of active students
     */
    getActiveStudentCount: (state): number => {
      return state.students.filter(
        (student) => student.status === StudentStatus.ACTIVE
      ).length;
    },

    /**
     * Check if group is full
     */
    isGroupFull: (state): boolean => {
      return (
        state.students.filter(
          (student) => student.status === StudentStatus.ACTIVE
        ).length >= state.maxStudents
      );
    },

    /**
     * Check if can register more students
     */
    canRegisterMore: (state): boolean => {
      return (
        state.students.filter(
          (student) => student.status === StudentStatus.ACTIVE
        ).length < state.maxStudents
      );
    },

    /**
     * Get number of available spots
     */
    getAvailableSpots: (state): number => {
      const activeCount = state.students.filter(
        (student) => student.status === StudentStatus.ACTIVE
      ).length;
      return Math.max(0, state.maxStudents - activeCount);
    },

    /**
     * Get students with financial data
     */
    getStudentsWithFinancials:
      (state) =>
      (currentWeek: number): StudentWithFinancials[] => {
        const tierStore = useTierStore();

        return state.students.map((student) => {
          const tier = tierStore.getTierById(student.tierId);
          if (!tier) throw new Error(`Invalid tier ID: ${student.tierId}`);

          const joinDate = new Date(student.joinedDate);
          const now = new Date();
          const weeksActive = currentWeek; // Use simulation week

          const { principal, interestAmount, totalAmount } =
            calculateAccumulatedInterest(
              student.tierId,
              tier.amount,
              weeksActive
            );

          return {
            ...student,
            principal,
            interestEarned: interestAmount,
            totalAmount,
            weeksActive,
          };
        });
      },
  },

  actions: {
    /**
     * Set current registration data
     */
    setRegistrationData(data: StudentRegistrationData) {
      this.currentRegistrationData = data;
    },

    /**
     * Clear current registration data
     */
    clearRegistrationData() {
      this.currentRegistrationData = null;
    },

    /**
     * Register a new student
     */
    registerStudent(data: StudentRegistrationData): {
      success: boolean;
      error?: string;
      student?: StudentInfo;
    } {
      // Check if group is full
      if (this.isGroupFull) {
        return {
          success: false,
          error:
            "The savings group is full. Please try again when a spot becomes available.",
        };
      }

      // Validate registration data
      const { isValid, errors } = validateStudentRegistration(data);
      if (!isValid) {
        return { success: false, error: Object.values(errors)[0] };
      }

      // Validate tier amount
      if (!validateTierAmount(data.tierId, data.amount)) {
        return {
          success: false,
          error: "The amount does not match the selected tier.",
        };
      }

      // Create new student
      const newStudent: StudentInfo = {
        id: uuidv4(),
        name: data.name.trim(),
        tierId: data.tierId,
        joinedDate: new Date(),
        status: StudentStatus.ACTIVE,
      };

      // Add to store
      this.students.push(newStudent);

      return { success: true, student: newStudent };
    },

    /**
     * Withdraw a student
     */
    withdrawStudent(
      id: StudentId,
      currentWeek: number
    ): { success: boolean; error?: string; withdrawal?: StudentWithdrawal } {
      const studentIndex = this.students.findIndex(
        (student) => student.id === id
      );

      if (studentIndex === -1) {
        return { success: false, error: "Student not found." };
      }

      const student = this.students[studentIndex];

      if (student.status !== StudentStatus.ACTIVE) {
        return { success: false, error: "Student has already withdrawn." };
      }

      // Calculate withdrawal amount
      const tierStore = useTierStore();
      const tier = tierStore.getTierById(student.tierId);

      if (!tier) {
        return { success: false, error: "Invalid tier information." };
      }

      const { totalAmount } = calculateAccumulatedInterest(
        student.tierId,
        tier.amount,
        currentWeek
      );

      // Update student status
      this.students[studentIndex] = {
        ...student,
        status: StudentStatus.WITHDRAWN,
      };

      const withdrawal: StudentWithdrawal = {
        studentId: id,
        withdrawalDate: new Date(),
        amountWithdrawn: totalAmount,
      };

      return { success: true, withdrawal };
    },

    /**
     * Initialize store with test data (for development only)
     */
    initializeWithTestData() {
      const testStudents: StudentInfo[] = [
        {
          id: uuidv4(),
          name: "John Doe",
          tierId: TierLevel.TIER_1,
          joinedDate: new Date(),
          status: StudentStatus.ACTIVE,
        },
        {
          id: uuidv4(),
          name: "Jane Smith",
          tierId: TierLevel.TIER_2,
          joinedDate: new Date(),
          status: StudentStatus.ACTIVE,
        },
        {
          id: uuidv4(),
          name: "Bob Johnson",
          tierId: TierLevel.TIER_3,
          joinedDate: new Date(),
          status: StudentStatus.ACTIVE,
        },
      ];

      this.students = testStudents;
    },
  },
});
