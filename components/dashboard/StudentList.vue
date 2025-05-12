<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStudentStore } from '../../stores/student';
import { useSavingsStore } from '../../stores/savings';
import { useUIStore } from '../../stores/ui';
import { useSimulation } from '../../composables/useSimulation';
import { useSavings } from '../../composables/useSavings';
import type { StudentWithFinancials } from '../../types/student';
import { TierLevel } from '../../types/tier';
import AppCard from '../common/AppCard.vue';
import AppButton from '../common/AppButton.vue';
import StudentCard from './StudentCard.vue';
import AppModal from '../common/AppModal.vue';

// Store and composable setup
const studentStore = useStudentStore();
const savingsStore = useSavingsStore();
const uiStore = useUIStore();
const { studentsWithFinancials, currentWeek } = useSavings();
const { withdrawStudent, processWithdrawal } = useSimulation();

const router = useRouter();

// State
const searchQuery = ref('');
const selectedTierFilter = ref<TierLevel | null>(null);
const showWithdrawn = ref(false);
const confirmingWithdrawal = ref(false);
const selectedStudentId = ref<string | null>(null);

// Sort options
const sortOptions = [
  { id: 'nameAsc', label: 'Name (A-Z)' },
  { id: 'nameDesc', label: 'Name (Z-A)' },
  { id: 'tierAsc', label: 'Tier (Low to High)' },
  { id: 'tierDesc', label: 'Tier (High to Low)' },
  { id: 'interestAsc', label: 'Interest (Low to High)' },
  { id: 'interestDesc', label: 'Interest (High to Low)' },
  { id: 'totalAsc', label: 'Total Amount (Low to High)' },
  { id: 'totalDesc', label: 'Total Amount (High to Low)' },
];
const selectedSort = ref(sortOptions[0].id);

// Computed properties
const availableStudents = computed(() => {
  let filtered = studentsWithFinancials.value;
  
  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(student => 
      student.name.toLowerCase().includes(query)
    );
  }
  
  // Filter by tier
  if (selectedTierFilter.value !== null) {
    filtered = filtered.filter(student => 
      student.tierId === selectedTierFilter.value
    );
  }
  
  // Filter by status
  if (!showWithdrawn.value) {
    filtered = filtered.filter(student => 
      student.status === 'active'
    );
  }
  
  // Sort students
  return filtered.sort((a, b) => {
    switch (selectedSort.value) {
      case 'nameAsc':
        return a.name.localeCompare(b.name);
      case 'nameDesc':
        return b.name.localeCompare(a.name);
      case 'tierAsc':
        return a.tierId - b.tierId;
      case 'tierDesc':
        return b.tierId - a.tierId;
      case 'interestAsc':
        return a.interestEarned - b.interestEarned;
      case 'interestDesc':
        return b.interestEarned - a.interestEarned;
      case 'totalAsc':
        return a.totalAmount - b.totalAmount;
      case 'totalDesc':
        return b.totalAmount - a.totalAmount;
      default:
        return 0;
    }
  });
});

const selectedStudent = computed(() => {
  if (!selectedStudentId.value) return null;
  return studentsWithFinancials.value.find(s => s.id === selectedStudentId.value) || null;
});

// Methods
const handleWithdraw = (studentId: string) => {
  selectedStudentId.value = studentId;
  confirmingWithdrawal.value = true;
};

const confirmWithdrawal = () => {
  if (selectedStudentId.value) {
    processWithdrawal(selectedStudentId.value);
    confirmingWithdrawal.value = false;
    selectedStudentId.value = null;
  }
};

const cancelWithdrawal = () => {
  confirmingWithdrawal.value = false;
  selectedStudentId.value = null;
};

const handleFilterTier = (tierId: TierLevel | null) => {
  selectedTierFilter.value = tierId;
};

const navigateToRegistration = () => {
  router.push('/register');
};
</script>

<template>
  <div class="space-y-6">
    <!-- Filters -->
    <AppCard shadow>
      <div class="space-y-4">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <!-- Search box -->
          <div>
            <label for="search" class="block text-sm font-medium text-gray-700">Search Students</label>
            <div class="mt-1 relative rounded-md shadow-sm">
              <input
                id="search"
                v-model="searchQuery"
                type="text"
                class="focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Search by name..."
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Sort options -->
          <div>
            <label for="sort" class="block text-sm font-medium text-gray-700">Sort By</label>
            <select
              id="sort"
              v-model="selectedSort"
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option v-for="option in sortOptions" :key="option.id" :value="option.id">
                {{ option.label }}
              </option>
            </select>
          </div>
          
          <!-- Show withdrawn checkbox -->
          <div class="flex items-end">
            <div class="flex items-center h-10">
              <input
                id="showWithdrawn"
                v-model="showWithdrawn"
                type="checkbox"
                class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label for="showWithdrawn" class="ml-2 block text-sm text-gray-700">
                Show Withdrawn Students
              </label>
            </div>
          </div>
        </div>
        
        <!-- Tier filters -->
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-sm font-medium text-gray-700">Filter by Tier:</span>
            <AppButton
              size="xs"
              :variant="selectedTierFilter === null ? 'primary' : 'light'"
              @click="handleFilterTier(null)"
            >
              All Tiers
            </AppButton>
            <AppButton
              size="xs"
              :variant="selectedTierFilter === 1 ? 'primary' : 'light'"
              @click="handleFilterTier(1)"
            >
              Tier 1
            </AppButton>
            <AppButton
              size="xs"
              :variant="selectedTierFilter === 2 ? 'primary' : 'light'"
              @click="handleFilterTier(2)"
            >
              Tier 2
            </AppButton>
            <AppButton
              size="xs"
              :variant="selectedTierFilter === 3 ? 'primary' : 'light'"
              @click="handleFilterTier(3)"
            >
              Tier 3
            </AppButton>
          </div>
        </div>
      </div>
    </AppCard>
    
    <!-- Student list -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <StudentCard 
        v-for="student in availableStudents"
        :key="student.id"
        :student="student"
        :current-week="currentWeek"
        @withdraw="handleWithdraw"
      />
    </div>
    
    <!-- Empty state -->
    <div v-if="availableStudents.length === 0" class="text-center py-12">
      <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">No students found</h3>
      <p class="mt-1 text-sm text-gray-500">
        {{ searchQuery.trim() ? 'Try adjusting your search or filters.' : 'Register students to get started.' }}
      </p>
      <div class="mt-6">
        <AppButton 
          variant="primary"
          @click="navigateToRegistration"
        >
          Register New Student
        </AppButton>
      </div>
    </div>
    
    <!-- Withdrawal confirmation modal -->
    <AppModal
      v-model="confirmingWithdrawal"
      title="Confirm Withdrawal"
      confirm-text="Withdraw"
      confirm-variant="danger"
      @confirm="confirmWithdrawal"
      @cancel="cancelWithdrawal"
    >
      <div v-if="selectedStudent">
        <p class="text-sm text-gray-500">
          Are you sure you want to withdraw <strong>{{ selectedStudent.name }}</strong> from the savings group?
          This action will remove them from the active members list.
        </p>
        <div class="mt-4 bg-gray-50 p-4 rounded-md">
          <p class="text-sm font-medium text-gray-700">Withdrawal Amount</p>
          <p class="text-xl font-bold text-blue-600">{{ formatCurrency(selectedStudent.totalAmount) }}</p>
          <div class="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span class="text-gray-500">Principal:</span>
              <span class="font-medium ml-1">{{ formatCurrency(selectedStudent.principal) }}</span>
            </div>
            <div>
              <span class="text-gray-500">Interest:</span>
              <span class="font-medium ml-1 text-green-600">{{ formatCurrency(selectedStudent.interestEarned) }}</span>
            </div>
          </div>
        </div>
      </div>
    </AppModal>
  </div>
</template>