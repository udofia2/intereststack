import { defineStore } from "pinia";
import type {
  GroupSavings,
  SavingsSimulation,
  WeeklyInterest,
  SavingsSummary,
  GameInvestment,
} from "../types/savings";
import type { StudentId } from "../types/student";
import { useStudentStore } from "./student";
import {
  calculateGroupSavingsSummary,
  calculateGameReturn,
} from "../utils/calculations";

interface SavingsState {
  simulation: SavingsSimulation;
  gameInvestment: GameInvestment;
}

export const useSavingsStore = defineStore("savings", {
  state: (): SavingsState => ({
    simulation: {
      currentWeek: 0,
      startDate: new Date(),
      lastUpdated: new Date(),
      weeklyHistory: [],
    },
    gameInvestment: {
      investedAmount: 0,
      returnRate: 20, // 20% as specified in requirements
      expectedReturn: 0,
    },
  }),

  getters: {
    /**
     * Get current week of simulation
     */
    getCurrentWeek: (state): number => state.simulation.currentWeek,

    /**
     * Get savings summary
     */
    getSavingsSummary: (state): SavingsSummary => {
      const studentStore = useStudentStore();
      const studentsWithFinancials = studentStore.getStudentsWithFinancials(
        state.simulation.currentWeek
      );

      return calculateGroupSavingsSummary(
        studentsWithFinancials,
        state.simulation.currentWeek
      );
    },

    /**
     * Get group savings information
     */
    getGroupSavings: (state): GroupSavings => {
      const summary = calculateGroupSavingsSummary(
        useStudentStore().getStudentsWithFinancials(
          state.simulation.currentWeek
        ),
        state.simulation.currentWeek
      );

      return {
        totalPrincipal: summary.totalSaved,
        totalInterest: summary.totalInterest,
        totalAmount: summary.totalAmount,
        memberCount: useStudentStore().getActiveStudentCount,
        currentWeek: state.simulation.currentWeek,
        gameplayReturnRate: state.gameInvestment.returnRate,
      };
    },

    /**
     * Get weekly history
     */
    getWeeklyHistory: (state): WeeklyInterest[] =>
      state.simulation.weeklyHistory,

    /**
     * Get game investment details
     */
    getGameInvestment: (state): GameInvestment => {
         const savingsStore = useSavingsStore()

      // Update the invested amount based on current total
      const totalAmount = savingsStore.getGroupSavings.totalAmount;
      const expectedReturn = calculateGameReturn(
        totalAmount,
        state.gameInvestment.returnRate
      );

      return {
        investedAmount: totalAmount,
        returnRate: state.gameInvestment.returnRate,
        expectedReturn,
      };
    },
  },

  actions: {
    /**
     * Advance simulation by one week
     */
    advanceWeek(): void {
      // Get current data
      const studentStore = useStudentStore();
      const studentsWithFinancials = studentStore.getStudentsWithFinancials(
        this.simulation.currentWeek
      );

      // Calculate interest for each student this week
      const perStudentInterest: Record<StudentId, number> = {};
      let totalInterestGenerated = 0;

      studentsWithFinancials
        .filter((student) => student.status === "active")
        .forEach((student) => {
          // Calculate weekly interest for this student
          const weeklyInterest =
            student.principal *
            (student.tierId === 1 ? 0.05 : student.tierId === 2 ? 0.1 : 0.2);
          perStudentInterest[student.id] = weeklyInterest;
          totalInterestGenerated += weeklyInterest;
        });

      // Create record of this week
      const weekRecord: WeeklyInterest = {
        week: this.simulation.currentWeek + 1,
        date: new Date(),
        totalInterestGenerated,
        perStudentInterest,
      };

      // Update simulation state
      this.simulation.weeklyHistory.push(weekRecord);
      this.simulation.currentWeek += 1;
      this.simulation.lastUpdated = new Date();

      // Update game investment expected return
      const groupSavings = this.getGroupSavings;
      this.gameInvestment.investedAmount = groupSavings.totalAmount;
      this.gameInvestment.expectedReturn = calculateGameReturn(
        groupSavings.totalAmount,
        this.gameInvestment.returnRate
      );
    },

    /**
     * Reset simulation to week 0
     */
    resetSimulation(): void {
      this.simulation = {
        currentWeek: 0,
        startDate: new Date(),
        lastUpdated: new Date(),
        weeklyHistory: [],
      };

      this.gameInvestment = {
        investedAmount: 0,
        returnRate: 20,
        expectedReturn: 0,
      };
    },
  },
});
