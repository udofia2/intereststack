<script setup lang="ts">
import { useSavingsStore } from '../../stores/savings';
import { useSavings } from '../../composables/useSavings';
import { useSimulation } from '../../composables/useSimulation';
import { formatCurrency, formatWeek } from '../../utils/formatters';
import AppCard from '../common/AppCard.vue';

// Composable setup
const savingsStore = useSavingsStore();
const { currentWeek, weeklyHistory } = useSimulation();
const { groupSavings, tierBreakdown, savingsSummary } = useSavings();

// Chart type options
type ChartType = 'line' | 'bar' | 'pie';
const chartTypes: ChartType[] = ['line', 'bar', 'pie'];
const selectedChartType = ref<ChartType>('line');

// Chart data time period
type TimePeriod = 'all' | 'last4' | 'last8';
const timePeriods = [
  { value: 'all', label: 'All Time' },
  { value: 'last4', label: 'Last 4 Weeks' },
  { value: 'last8', label: 'Last 8 Weeks' }
];
const selectedTimePeriod = ref<TimePeriod>('all');

// Chart metric to display
type ChartMetric = 'interest' | 'total' | 'tier';
const chartMetrics = [
  { value: 'interest', label: 'Interest Growth' },
  { value: 'total', label: 'Total Savings' },
  { value: 'tier', label: 'Tier Breakdown' }
];
const selectedMetric = ref<ChartMetric>('interest');

// Chart colors
const chartColors = {
  primary: '#3B82F6', // blue-500
  secondary: '#6B7280', // gray-500
  success: '#10B981', // green-500
  danger: '#EF4444', // red-500
  warning: '#F59E0B', // amber-500
  info: '#3B82F6', // blue-500
  tier1: '#60A5FA', // blue-400
  tier2: '#34D399', // green-400
  tier3: '#F472B6', // pink-400
  background: '#F9FAFB', // gray-50
  text: '#1F2937', // gray-800
  grid: '#E5E7EB' // gray-200
};

// Computed chart data based on selections
const chartData = computed(() => {
  // Determine weeks to include based on selected time period
  let weeksToInclude = weeklyHistory.value.length;
  if (selectedTimePeriod.value === 'last4') {
    weeksToInclude = Math.min(4, weeklyHistory.value.length);
  } else if (selectedTimePeriod.value === 'last8') {
    weeksToInclude = Math.min(8, weeklyHistory.value.length);
  }
  
  // Get the subset of history we want to display
  const relevantHistory = weeklyHistory.value.slice(-weeksToInclude);
  
  // Create data for line/bar charts (time series)
  if (selectedChartType.value === 'line' || selectedChartType.value === 'bar') {
    // Different metrics to chart
    if (selectedMetric.value === 'interest') {
      // Chart weekly interest growth
      return {
        labels: relevantHistory.map(week => `Week ${week.week}`),
        datasets: [{
          label: 'Weekly Interest Generated',
          data: relevantHistory.map(week => week.totalInterestGenerated),
          backgroundColor: chartColors.success,
          borderColor: chartColors.success,
          borderWidth: 2,
          fill: false,
          tension: 0.4
        }]
      };
    } else if (selectedMetric.value === 'total') {
      // Chart total savings growth
      // We need to calculate cumulative totals
      let cumulativeInterest = 0;
      return {
        labels: relevantHistory.map(week => `Week ${week.week}`),
        datasets: [{
          label: 'Total Savings',
          data: relevantHistory.map(week => {
            cumulativeInterest += week.totalInterestGenerated;
            // This is simplified - in a real app we'd track actual totals per week
            return groupSavings.value.totalPrincipal + cumulativeInterest;
          }),
          backgroundColor: chartColors.primary,
          borderColor: chartColors.primary,
          borderWidth: 2,
          fill: false,
          tension: 0.4
        }]
      };
    } else if (selectedMetric.value === 'tier') {
      // Chart contribution by tier over time
      // Simplified - in a real app would track tier totals per week
      return {
        labels: relevantHistory.map(week => `Week ${week.week}`),
        datasets: [
          {
            label: 'Tier 1',
            data: relevantHistory.map(() => tierBreakdown.value[0]?.total || 0),
            backgroundColor: chartColors.tier1,
            borderColor: chartColors.tier1,
            borderWidth: 2,
            fill: false,
          },
          {
            label: 'Tier 2',
            data: relevantHistory.map(() => tierBreakdown.value[1]?.total || 0),
            backgroundColor: chartColors.tier2,
            borderColor: chartColors.tier2,
            borderWidth: 2,
            fill: false,
          },
          {
            label: 'Tier 3',
            data: relevantHistory.map(() => tierBreakdown.value[2]?.total || 0),
            backgroundColor: chartColors.tier3,
            borderColor: chartColors.tier3,
            borderWidth: 2,
            fill: false,
          }
        ]
      };
    }
  } 
  // Create data for pie chart
  else if (selectedChartType.value === 'pie') {
    if (selectedMetric.value === 'tier') {
      // Pie chart of tier distribution
      return {
        labels: ['Tier 1', 'Tier 2', 'Tier 3'],
        datasets: [{
          data: [
            tierBreakdown.value[0]?.total || 0,
            tierBreakdown.value[1]?.total || 0,
            tierBreakdown.value[2]?.total || 0
          ],
          backgroundColor: [
            chartColors.tier1,
            chartColors.tier2,
            chartColors.tier3
          ],
          borderWidth: 1
        }]
      };
    } else {
      // Pie chart of principal vs interest
      return {
        labels: ['Principal', 'Interest'],
        datasets: [{
          data: [
            groupSavings.value.totalPrincipal,
            groupSavings.value.totalInterest
          ],
          backgroundColor: [
            chartColors.secondary,
            chartColors.success
          ],
          borderWidth: 1
        }]
      };
    }
  }
  
  // Fallback empty chart data
  return {
    labels: [],
    datasets: []
  };
});

// Chart configuration
const chartConfig = computed(() => {
  const baseConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += formatCurrency(context.parsed.y || context.parsed || 0);
            return label;
          }
        }
      }
    }
  };
  
  // Line/bar chart specific options
  if (selectedChartType.value === 'line' || selectedChartType.value === 'bar') {
    return {
      ...baseConfig,
      scales: {
        x: {
          grid: {
            color: chartColors.grid
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: chartColors.grid
          },
          ticks: {
            callback: (value: number) => {
              return formatCurrency(value, 0);
            }
          }
        }
      }
    };
  } 
  // Pie chart specific options
  else if (selectedChartType.value === 'pie') {
    return baseConfig;
  }
  
  return baseConfig;
});

// Chart rendering logic
const chartCanvas = ref<HTMLCanvasElement | null>(null);
let chart: any = null;

// Initialize and update chart
const renderChart = () => {
  if (!chartCanvas.value) return;
  
  // Clean up previous chart if it exists
  if (chart) {
    chart.destroy();
  }
  
  // Get the canvas context
  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;
  
  // Create chart library import dynamically (in real app we'd use proper import)
  // This is just for demonstration - in practice, we'd use the recharts library as planned
  // and create an appropriate chart component
  const ChartLibrary = {
    line: () => {
      // Simulate line chart rendering
      ctx.clearRect(0, 0, chartCanvas.value!.width, chartCanvas.value!.height);
      ctx.fillStyle = chartColors.background;
      ctx.fillRect(0, 0, chartCanvas.value!.width, chartCanvas.value!.height);
      
      ctx.font = '14px Arial';
      ctx.fillStyle = chartColors.text;
      ctx.textAlign = 'center';
      ctx.fillText('Line Chart: ' + selectedMetric.value, chartCanvas.value!.width / 2, 20);
      
      // Render a sample line chart
      const data = chartData.value;
      const labels = data.labels || [];
      const dataset = data.datasets && data.datasets[0];
      
      if (dataset && dataset.data && dataset.data.length > 0) {
        const values = dataset.data;
        const maxValue = Math.max(...values as number[]);
        const points: [number, number][] = [];
        
        const padding = 40;
        const chartWidth = chartCanvas.value!.width - padding * 2;
        const chartHeight = chartCanvas.value!.height - padding * 2;
        
        // Calculate points
        values.forEach((value, index) => {
          const x = padding + (chartWidth * index) / (values.length - 1 || 1);
          const y = chartCanvas.value!.height - padding - (chartHeight * (value as number)) / (maxValue || 1);
          points.push([x, y]);
        });
        
        // Draw line
        ctx.beginPath();
        ctx.strokeStyle = dataset.borderColor || chartColors.primary;
        ctx.lineWidth = 2;
        points.forEach((point, index) => {
          if (index === 0) ctx.moveTo(point[0], point[1]);
          else ctx.lineTo(point[0], point[1]);
        });
        ctx.stroke();
        
        // Draw points
        points.forEach(point => {
          ctx.beginPath();
          ctx.fillStyle = dataset.backgroundColor || chartColors.primary;
          ctx.arc(point[0], point[1], 4, 0, Math.PI * 2);
          ctx.fill();
        });
        
        // Draw labels
        labels.forEach((label, index) => {
          const x = padding + (chartWidth * index) / (labels.length - 1 || 1);
          ctx.fillStyle = chartColors.text;
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(label.toString(), x, chartCanvas.value!.height - padding / 2);
        });
      } else {
        ctx.fillText('No data available', chartCanvas.value!.width / 2, chartCanvas.value!.height / 2);
      }
    },
    bar: () => {
      // Simulate bar chart rendering
      ctx.clearRect(0, 0, chartCanvas.value!.width, chartCanvas.value!.height);
      ctx.fillStyle = chartColors.background;
      ctx.fillRect(0, 0, chartCanvas.value!.width, chartCanvas.value!.height);
      
      ctx.font = '14px Arial';
      ctx.fillStyle = chartColors.text;
      ctx.textAlign = 'center';
      ctx.fillText('Bar Chart: ' + selectedMetric.value, chartCanvas.value!.width / 2, 20);
      
      // Render a sample bar chart
      const data = chartData.value;
      const labels = data.labels || [];
      const dataset = data.datasets && data.datasets[0];
      
      if (dataset && dataset.data && dataset.data.length > 0) {
        const values = dataset.data;
        const maxValue = Math.max(...values as number[]);
        
        const padding = 40;
        const chartWidth = chartCanvas.value!.width - padding * 2;
        const chartHeight = chartCanvas.value!.height - padding * 2;
        const barWidth = (chartWidth / values.length) * 0.8;
        const spacing = (chartWidth / values.length) * 0.2;
        
        // Draw bars
        values.forEach((value, index) => {
          const barHeight = (chartHeight * (value as number)) / (maxValue || 1);
          const x = padding + (chartWidth * index) / values.length + spacing / 2;
          const y = chartCanvas.value!.height - padding - barHeight;
          
          ctx.fillStyle = dataset.backgroundColor || chartColors.primary;
          ctx.fillRect(x, y, barWidth, barHeight);
        });
        
        // Draw labels
        labels.forEach((label, index) => {
          const x = padding + (chartWidth * index) / values.length + barWidth / 2 + spacing / 2;
          ctx.fillStyle = chartColors.text;
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(label.toString(), x, chartCanvas.value!.height - padding / 2);
        });
      } else {
        ctx.fillText('No data available', chartCanvas.value!.width / 2, chartCanvas.value!.height / 2);
      }
    },
    pie: () => {
      // Simulate pie chart rendering
      ctx.clearRect(0, 0, chartCanvas.value!.width, chartCanvas.value!.height);
      ctx.fillStyle = chartColors.background;
      ctx.fillRect(0, 0, chartCanvas.value!.width, chartCanvas.value!.height);
      
      ctx.font = '14px Arial';
      ctx.fillStyle = chartColors.text;
      ctx.textAlign = 'center';
      ctx.fillText('Pie Chart: ' + selectedMetric.value, chartCanvas.value!.width / 2, 20);
      
      // Render a sample pie chart
      const data = chartData.value;
      const labels = data.labels || [];
      const dataset = data.datasets && data.datasets[0];
      
      if (dataset && dataset.data && dataset.data.length > 0) {
        const values = dataset.data as number[];
        const colors = dataset.backgroundColor as string[];
        
        const total = values.reduce((sum, value) => sum + value, 0);
        let startAngle = 0;
        
        const centerX = chartCanvas.value!.width / 2;
        const centerY = chartCanvas.value!.height / 2;
        const radius = Math.min(centerX, centerY) - 40;
        
        // Draw pie slices
        values.forEach((value, index) => {
          const sliceAngle = (value / total) * Math.PI * 2;
          
          ctx.beginPath();
          ctx.fillStyle = colors[index] || chartColors.primary;
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
          ctx.closePath();
          ctx.fill();
          
          // Draw label
          const labelAngle = startAngle + sliceAngle / 2;
          const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
          const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
          
          ctx.font = '12px Arial';
          ctx.fillStyle = chartColors.text;
          ctx.textAlign = 'center';
          ctx.fillText(labels[index]?.toString() || '', labelX, labelY);
          
          startAngle += sliceAngle;
        });
      } else {
        ctx.fillText('No data available', chartCanvas.value!.width / 2, chartCanvas.value!.height / 2);
      }
    }
  };
  
  // Render the selected chart type
  ChartLibrary[selectedChartType.value]();
  
  // In a real application, we would use a proper charting library like this:
  /*
  import { Chart, registerables } from 'chart.js';
  Chart.register(...registerables);
  
  chart = new Chart(ctx, {
    type: selectedChartType.value,
    data: chartData.value,
    options: chartConfig.value
  });
  */
};

// Watch for changes that should trigger chart update
watch(
  [selectedChartType, selectedMetric, selectedTimePeriod, currentWeek],
  () => {
    renderChart();
  }
);

// Initialize chart on component mount
onMounted(() => {
  renderChart();
});
</script>

<template>
  <AppCard title="Interest Growth Analytics" shadow>
    <div class="space-y-6">
      <!-- Chart controls -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <!-- Chart type selector -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Chart Type</label>
          <div class="mt-1 flex rounded-md shadow-sm">
            <button
              v-for="type in chartTypes"
              :key="type"
              class="flex-1 inline-flex justify-center items-center px-4 py-2 text-sm font-medium border focus:outline-none focus:ring-1 focus:ring-blue-500"
              :class="{
                'bg-blue-600 text-white border-blue-600': selectedChartType === type,
                'bg-white text-gray-700 border-gray-300 hover:bg-gray-50': selectedChartType !== type,
                'rounded-l-md': type === 'line',
                'rounded-r-md': type === 'pie'
              }"
              @click="selectedChartType = type"
            >
              {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </button>
          </div>
        </div>
        
        <!-- Chart metric selector -->
        <div>
          <label for="chartMetric" class="block text-sm font-medium text-gray-700">Metric</label>
          <select
            id="chartMetric"
            v-model="selectedMetric"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option v-for="metric in chartMetrics" :key="metric.value" :value="metric.value">
              {{ metric.label }}
            </option>
          </select>
        </div>
        
        <!-- Time period selector -->
        <div>
          <label for="timePeriod" class="block text-sm font-medium text-gray-700">Time Period</label>
          <select
            id="timePeriod"
            v-model="selectedTimePeriod"
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option v-for="period in timePeriods" :key="period.value" :value="period.value">
              {{ period.label }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- Chart container -->
      <div class="h-80 relative">
        <canvas ref="chartCanvas" class="w-full h-full"></canvas>
        
        <!-- No data message -->
        <div
          v-if="!weeklyHistory.length"
          class="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-90 rounded"
        >
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No data available</h3>
            <p class="mt-1 text-sm text-gray-500">
              Advance the simulation to generate interest data.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Chart summary -->
      <div class="border-t border-gray-200 pt-4">
        <h3 class="text-sm font-medium text-gray-700">Summary</h3>
        <div class="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p class="text-sm text-gray-500">Total Principal</p>
            <p class="text-base font-medium">{{ formatCurrency(groupSavings.totalPrincipal) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Total Interest</p>
            <p class="text-base font-medium text-green-600">{{ formatCurrency(groupSavings.totalInterest) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Return on Investment</p>
            <p class="text-base font-medium text-blue-600">{{ formatPercentage(savingsSummary.returnOnInvestment) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Current Week</p>
            <p class="text-base font-medium">{{ formatWeek(currentWeek) }}</p>
          </div>
        </div>
      </div>
    </div>
  </AppCard>
</template>