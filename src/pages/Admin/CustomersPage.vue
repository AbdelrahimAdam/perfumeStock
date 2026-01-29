<!-- src/pages/Admin/CustomersPage.vue -->
<template>
  <div class="customers-page p-6">
    <!-- Page Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ t('Customers') }}</h1>
        <p class="text-gray-600">{{ t('Manage all registered customers') }}</p>
      </div>
      
      <div class="flex items-center gap-3 mt-4 md:mt-0">
        <!-- Search -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('Search customers...')"
            class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500 w-full md:w-64"
          >
          <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        
        <!-- Export Button -->
        <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          {{ t('Export') }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl p-4 shadow border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">{{ t('Total Customers') }}</p>
            <p class="text-2xl font-bold">{{ stats.totalCustomers.toLocaleString() }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-full">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
        </div>
        <p class="text-xs text-green-600 mt-2">
          <span class="font-semibold">+12%</span> {{ t('from last month') }}
        </p>
      </div>

      <div class="bg-white rounded-xl p-4 shadow border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">{{ t('Active Customers') }}</p>
            <p class="text-2xl font-bold">{{ stats.activeCustomers.toLocaleString() }}</p>
          </div>
          <div class="p-3 bg-green-100 rounded-full">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
        <p class="text-xs text-green-600 mt-2">
          <span class="font-semibold">+8%</span> {{ t('from last month') }}
        </p>
      </div>

      <div class="bg-white rounded-xl p-4 shadow border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">{{ t('New This Month') }}</p>
            <p class="text-2xl font-bold">{{ stats.newThisMonth.toLocaleString() }}</p>
          </div>
          <div class="p-3 bg-yellow-100 rounded-full">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </div>
        </div>
        <p class="text-xs text-green-600 mt-2">
          <span class="font-semibold">+5%</span> {{ t('from last month') }}
        </p>
      </div>

      <div class="bg-white rounded-xl p-4 shadow border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">{{ t('Avg. Order Value') }}</p>
            <p class="text-2xl font-bold">{{ formatCurrency(stats.avgOrderValue) }}</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-full">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
        <p class="text-xs text-green-600 mt-2">
          <span class="font-semibold">+15%</span> {{ t('from last month') }}
        </p>
      </div>
    </div>

    <!-- Customers Table -->
    <div class="bg-white rounded-xl shadow border overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                <div class="flex items-center gap-2">
                  <input type="checkbox" class="rounded border-gray-300">
                  {{ t('Customer') }}
                </div>
              </th>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">{{ t('Email') }}</th>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">{{ t('Phone') }}</th>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">{{ t('Orders') }}</th>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">{{ t('Total Spent') }}</th>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">{{ t('Last Order') }}</th>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">{{ t('Status') }}</th>
              <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700">{{ t('Actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="customer in filteredCustomers" :key="customer.id" class="hover:bg-gray-50">
              <td class="py-4 px-4">
                <div class="flex items-center gap-3">
                  <input type="checkbox" class="rounded border-gray-300">
                  <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span class="font-semibold">{{ getInitials(customer.name) }}</span>
                  </div>
                  <div>
                    <p class="font-medium">{{ customer.name }}</p>
                    <p class="text-sm text-gray-500">ID: {{ customer.id.slice(0, 8) }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-4">
                <p class="text-sm">{{ customer.email }}</p>
              </td>
              <td class="py-4 px-4">
                <p class="text-sm">{{ customer.phone || '-' }}</p>
              </td>
              <td class="py-4 px-4">
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {{ customer.orders }}
                </span>
              </td>
              <td class="py-4 px-4 font-medium">
                {{ formatCurrency(customer.totalSpent) }}
              </td>
              <td class="py-4 px-4 text-sm text-gray-600">
                {{ formatDate(customer.lastOrder) }}
              </td>
              <td class="py-4 px-4">
                <span :class="[
                  'px-3 py-1 rounded-full text-sm',
                  customer.status === 'Active' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                ]">
                  {{ t(customer.status) }}
                </span>
              </td>
              <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                  <button 
                    @click="viewCustomer(customer.id)"
                    class="p-2 text-gray-500 hover:text-blue-600"
                    :title="t('View Details')"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button 
                    @click="editCustomer(customer.id)"
                    class="p-2 text-gray-500 hover:text-yellow-600"
                    :title="t('Edit')"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button 
                    @click="deleteCustomer(customer.id)"
                    class="p-2 text-gray-500 hover:text-red-600"
                    :title="t('Delete')"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredCustomers.length === 0" class="py-12 text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">{{ t('No customers found') }}</h3>
        <p class="mt-1 text-gray-500">{{ t('Try adjusting your search or filter') }}</p>
      </div>

      <!-- Pagination -->
      <div v-if="filteredCustomers.length > 0" class="px-6 py-4 border-t flex items-center justify-between">
        <p class="text-sm text-gray-700">
          {{ t('Showing') }} 
          <span class="font-medium">{{ Math.min(pagination.page * pagination.perPage, filteredCustomers.length) }}</span>
          {{ t('of') }} 
          <span class="font-medium">{{ filteredCustomers.length }}</span>
          {{ t('customers') }}
        </p>
        <div class="flex gap-2">
          <button 
            @click="prevPage"
            :disabled="pagination.page === 1"
            class="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('Previous') }}
          </button>
          <button 
            @click="nextPage"
            :disabled="pagination.page * pagination.perPage >= filteredCustomers.length"
            class="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('Next') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const { t } = languageStore

// Data
const searchQuery = ref('')
const stats = ref({
  totalCustomers: 1245,
  activeCustomers: 892,
  newThisMonth: 156,
  avgOrderValue: 2450
})

const customers = ref([
  {
    id: 'CUST001',
    name: 'Ahmed Mohamed',
    email: 'ahmed.m@example.com',
    phone: '+20 100 123 4567',
    orders: 8,
    totalSpent: 19600,
    lastOrder: '2024-01-15',
    status: 'Active'
  },
  {
    id: 'CUST002',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+44 7911 123456',
    orders: 3,
    totalSpent: 7350,
    lastOrder: '2024-01-10',
    status: 'Active'
  },
  {
    id: 'CUST003',
    name: 'Mohammed Ali',
    email: 'm.ali@example.com',
    phone: '+966 55 123 4567',
    orders: 12,
    totalSpent: 29400,
    lastOrder: '2024-01-14',
    status: 'Active'
  },
  {
    id: 'CUST004',
    name: 'Fatima Hassan',
    email: 'fatima.h@example.com',
    phone: '+971 50 123 4567',
    orders: 5,
    totalSpent: 12250,
    lastOrder: '2024-01-05',
    status: 'Active'
  },
  {
    id: 'CUST005',
    name: 'James Wilson',
    email: 'james.w@example.com',
    phone: '+1 555 123 4567',
    orders: 1,
    totalSpent: 2450,
    lastOrder: '2023-12-20',
    status: 'Inactive'
  },
  {
    id: 'CUST006',
    name: 'Layla Ahmed',
    email: 'layla.a@example.com',
    phone: '+20 102 123 4567',
    orders: 6,
    totalSpent: 14700,
    lastOrder: '2024-01-12',
    status: 'Active'
  },
  {
    id: 'CUST007',
    name: 'Robert Chen',
    email: 'robert.c@example.com',
    phone: '+86 138 1234 5678',
    orders: 2,
    totalSpent: 4900,
    lastOrder: '2023-12-28',
    status: 'Active'
  },
  {
    id: 'CUST008',
    name: 'Aisha Khan',
    email: 'aisha.k@example.com',
    phone: '+92 300 123 4567',
    orders: 4,
    totalSpent: 9800,
    lastOrder: '2024-01-08',
    status: 'Active'
  }
])

const pagination = ref({
  page: 1,
  perPage: 10
})

// Computed
const filteredCustomers = computed(() => {
  let result = customers.value
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(customer => 
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query) ||
      customer.id.toLowerCase().includes(query)
    )
  }
  
  return result
})

// Methods
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP'
  }).format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const viewCustomer = (id: string) => {
  console.log('View customer:', id)
  // Navigate to customer details
}

const editCustomer = (id: string) => {
  console.log('Edit customer:', id)
  // Open edit modal
}

const deleteCustomer = (id: string) => {
  if (confirm(t('Are you sure you want to delete this customer?'))) {
    customers.value = customers.value.filter(c => c.id !== id)
  }
}

const prevPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--
  }
}

const nextPage = () => {
  if (pagination.value.page * pagination.value.perPage < filteredCustomers.value.length) {
    pagination.value.page++
  }
}

onMounted(() => {
  // Load real data from Firebase here
})
</script>

<style scoped>
.customers-page {
  min-height: calc(100vh - 80px);
}
</style>