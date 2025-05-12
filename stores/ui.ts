import { defineStore } from 'pinia';
import type { StudentId } from '../types/student';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timeout?: number;
}

interface ModalState {
  isOpen: boolean;
  type: string | null;
  data: any;
}

interface UIState {
  notifications: Notification[];
  modal: ModalState;
  activeView: 'registration' | 'dashboard';
  isLoadingData: boolean;
  selectedStudentId: StudentId | null;
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    notifications: [],
    modal: {
      isOpen: false,
      type: null,
      data: null
    },
    activeView: 'registration',
    isLoadingData: false,
    selectedStudentId: null
  }),

  getters: {
    /**
     * Get all notifications
     */
    getNotifications: (state) => state.notifications,
    
    /**
     * Check if any modal is open
     */
    isModalOpen: (state) => state.modal.isOpen,
    
    /**
     * Get modal information
     */
    getModalInfo: (state) => state.modal,
    
    /**
     * Get current active view
     */
    getCurrentView: (state) => state.activeView,
    
    /**
     * Check if data is loading
     */
    isLoading: (state) => state.isLoadingData,
    
    /**
     * Get selected student ID
     */
    getSelectedStudentId: (state) => state.selectedStudentId
  },

  actions: {
    /**
     * Add a notification
     */
    addNotification({ type, message, timeout = 5000 }: { 
      type: NotificationType; 
      message: string; 
      timeout?: number;
    }): string {
      const id = Date.now().toString();
      
      this.notifications.push({
        id,
        type,
        message,
        timeout
      });
      
      // Auto-remove notification after timeout
      if (timeout > 0) {
        setTimeout(() => {
          this.removeNotification(id);
        }, timeout);
      }
      
      return id;
    },
    
    /**
     * Remove a notification by ID
     */
    removeNotification(id: string): void {
      const index = this.notifications.findIndex(notification => notification.id === id);
      if (index !== -1) {
        this.notifications.splice(index, 1);
      }
    },
    
    /**
     * Clear all notifications
     */
    clearNotifications(): void {
      this.notifications = [];
    },
    
    /**
     * Open a modal
     */
    openModal(type: string, data: any = null): void {
      this.modal = {
        isOpen: true,
        type,
        data
      };
    },
    
    /**
     * Close the modal
     */
    closeModal(): void {
      this.modal = {
        isOpen: false,
        type: null,
        data: null
      };
    },
    
    /**
     * Set active view
     */
    setActiveView(view: 'registration' | 'dashboard'): void {
      this.activeView = view;
    },
    
    /**
     * Set loading state
     */
    setLoading(isLoading: boolean): void {
      this.isLoadingData = isLoading;
    },
    
    /**
     * Select a student
     */
    selectStudent(studentId: StudentId | null): void {
      this.selectedStudentId = studentId;
    },
    
    /**
     * Show success notification
     */
    showSuccess(message: string): void {
      this.addNotification({ type: 'success', message });
    },
    
    /**
     * Show error notification
     */
    showError(message: string): void {
      this.addNotification({ type: 'error', message });
    },
    
    /**
     * Show info notification
     */
    showInfo(message: string): void {
      this.addNotification({ type: 'info', message });
    },
    
    /**
     * Show warning notification
     */
    showWarning(message: string): void {
      this.addNotification({ type: 'warning', message });
    }
  }
});