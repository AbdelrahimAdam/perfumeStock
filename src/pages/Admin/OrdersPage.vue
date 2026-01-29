<template>
  <div class="min-h-screen bg-gray-50">
    <AdminSidebar />

    <div class="lg:ml-64">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200">
        <div class="px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-display-en font-bold text-gray-900">
                {{ t('Orders Management') }}
              </h1>
              <p class="text-gray-600 mt-1">
                {{ t('View and manage customer orders') }}
              </p>
            </div>
            <div class="flex items-center gap-4">
              <!-- Date Filter -->
              <div class="relative">
                <input
                  type="date"
                  v-model="dateFilter"
                  class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <!-- Export Button -->
              <button
                @click="exportOrders"
                class="px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50 transition-colors flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                {{ t('Export') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Total Orders -->
          <div class="bg-white rounded-xl shadow-luxury p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">{{ t('Total Orders') }}</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                  {{ orders.length }}
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  {{ t('All time') }}
                </p>
              </div>
              <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Pending Orders -->
          <div class="bg-white rounded-xl shadow-luxury p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">{{ t('Pending') }}</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                  {{ pendingOrdersCount }}
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  {{ t('Awaiting processing') }}
                </p>
              </div>
              <div class="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Completed Orders -->
          <div class="bg-white rounded-xl shadow-luxury p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">{{ t('Completed') }}</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                  {{ completedOrdersCount }}
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  {{ t('Successfully delivered') }}
                </p>
              </div>
              <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Revenue -->
          <div class="bg-white rounded-xl shadow-luxury p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">{{ t('Total Revenue') }}</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                  ${{ totalRevenue.toLocaleString() }}
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  {{ t('From all orders') }}
                </p>
              </div>
              <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Orders Table -->
        <div class="bg-white rounded-xl shadow-luxury overflow-hidden">
          <!-- Filters -->
          <div class="p-6 border-b border-gray-200">
            <div class="flex flex-wrap items-center gap-4">
              <!-- Status Filter -->
              <select
                v-model="statusFilter"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">{{ t('All Statuses') }}</option>
                <option value="pending">{{ t('Pending') }}</option>
                <option value="processing">{{ t('Processing') }}</option>
                <option value="shipped">{{ t('Shipped') }}</option>
                <option value="delivered">{{ t('Delivered') }}</option>
                <option value="cancelled">{{ t('Cancelled') }}</option>
              </select>

              <!-- Search -->
              <div class="relative flex-1 min-w-[200px]">
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="t('Search by order ID, customer name...')"
                  class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>

              <!-- Clear Filters -->
              <button
                v-if="hasActiveFilters"
                @click="clearFilters"
                class="px-4 py-2 text-gray-600 hover:text-primary-600"
              >
                {{ t('Clear Filters') }}
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="p-12 text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            <p class="text-gray-600 mt-4">{{ t('Loading orders...') }}</p>
          </div>

          <!-- Orders Table -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('Order ID') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('Customer') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('Date') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('Amount') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('Status') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('Actions') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="order in filteredOrders" 
                  :key="order.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      #{{ order.orderNumber }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ order.items.length }} {{ t('items') }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ order.customer.name }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ order.customer.email }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(order.createdAt) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-bold text-gray-900">
                      ${{ order.total.toFixed(2) }}
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ order.paymentMethod }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusClasses(order.status)" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                      {{ getStatusText(order.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center gap-3">
                      <button
                        @click="viewOrder(order)"
                        class="text-primary-600 hover:text-primary-700"
                        :title="t('View Details')"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                      <button
                        @click="updateStatus(order)"
                        class="text-gray-600 hover:text-primary-600"
                        :title="t('Update Status')"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        @click="printInvoice(order)"
                        class="text-gray-600 hover:text-primary-600"
                        :title="t('Print Invoice')"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-if="!loading && filteredOrders.length === 0" class="p-12 text-center">
            <div class="w-16 h-16 mx-auto mb-4 text-gray-300">
              <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ t('No orders found') }}
            </h3>
            <p class="text-gray-600">
              {{ t('Try adjusting your filters') }}
            </p>
          </div>

          <!-- Pagination -->
          <div v-if="!loading && filteredOrders.length > 0" class="px-6 py-4 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                {{ t('Showing') }} 
                <span class="font-medium">{{ filteredOrders.length }}</span>
                {{ t('of') }}
                <span class="font-medium">{{ orders.length }}</span>
                {{ t('orders') }}
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  {{ t('Previous') }}
                </button>
                <span class="px-3 py-1 text-sm text-gray-700">
                  {{ currentPage }} / {{ totalPages }}
                </span>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  {{ t('Next') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div 
      v-if="selectedOrder"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">
              {{ t('Order Details') }} #{{ selectedOrder.orderNumber }}
            </h3>
            <button
              @click="selectedOrder = null"
              class="text-gray-400 hover:text-gray-500"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="p-6">
          <!-- Order Summary -->
          <div class="grid md:grid-cols-2 gap-8 mb-8">
            <!-- Customer Information -->
            <div>
              <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                {{ t('Customer Information') }}
              </h4>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-600">{{ t('Name') }}</p>
                  <p class="font-medium">{{ selectedOrder.customer.name }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">{{ t('Email') }}</p>
                  <p class="font-medium">{{ selectedOrder.customer.email }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">{{ t('Phone') }}</p>
                  <p class="font-medium">{{ selectedOrder.customer.phone }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">{{ t('Shipping Address') }}</p>
                  <p class="font-medium">{{ selectedOrder.shippingAddress }}</p>
                </div>
              </div>
            </div>

            <!-- Order Information -->
            <div>
              <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
                {{ t('Order Information') }}
              </h4>
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-600">{{ t('Order Date') }}</p>
                  <p class="font-medium">{{ formatDate(selectedOrder.createdAt) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">{{ t('Status') }}</p>
                  <span :class="getStatusClasses(selectedOrder.status)" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ getStatusText(selectedOrder.status) }}
                  </span>
                </div>
                <div>
                  <p class="text-sm text-gray-600">{{ t('Payment Method') }}</p>
                  <p class="font-medium">{{ selectedOrder.paymentMethod }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">{{ t('Payment Status') }}</p>
                  <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                    {{ t('Paid') }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="mb-8">
            <h4 class="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              {{ t('Order Items') }}
            </h4>
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ t('Product') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ t('Price') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ t('Quantity') }}
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {{ t('Total') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="item in selectedOrder.items" :key="item.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-10 w-10 flex-shrink-0">
                          <img :src="item.image" :alt="item.name" class="h-10 w-10 rounded object-cover">
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ item.name }}
                          </div>
                          <div class="text-sm text-gray-500">
                            {{ item.size }} • {{ item.concentration }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${{ item.price.toFixed(2) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ item.quantity }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      ${{ (item.price * item.quantity).toFixed(2) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="3" class="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      {{ t('Subtotal') }}
                    </td>
                    <td class="px-6 py-4 text-sm font-bold text-gray-900">
                      ${{ selectedOrder.subtotal.toFixed(2) }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3" class="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      {{ t('Shipping') }}
                    </td>
                    <td class="px-6 py-4 text-sm font-bold text-gray-900">
                      ${{ selectedOrder.shippingCost.toFixed(2) }}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3" class="px-6 py-4 text-right text-sm font-medium text-gray-900">
                      {{ t('Total') }}
                    </td>
                    <td class="px-6 py-4 text-sm font-bold text-primary-600">
                      ${{ selectedOrder.total.toFixed(2) }}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3">
            <button
              @click="printInvoice(selectedOrder)"
              class="px-4 py-2 border border-primary-500 text-primary-500 rounded-lg hover:bg-primary-50"
            >
              {{ t('Print Invoice') }}
            </button>
            <button
              @click="updateStatus(selectedOrder)"
              class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              {{ t('Update Status') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Update Status Modal -->
    <div 
      v-if="showStatusModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          {{ t('Update Order Status') }} #{{ orderToUpdate?.orderNumber }}
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('Select Status') }}
            </label>
            <select
              v-model="newStatus"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="pending">{{ t('Pending') }}</option>
              <option value="processing">{{ t('Processing') }}</option>
              <option value="shipped">{{ t('Shipped') }}</option>
              <option value="delivered">{{ t('Delivered') }}</option>
              <option value="cancelled">{{ t('Cancelled') }}</option>
            </select>
          </div>
          <div v-if="newStatus === 'shipped' || newStatus === 'delivered'">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('Tracking Number') }}
            </label>
            <input
              v-model="trackingNumber"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              :placeholder="t('Enter tracking number')"
            />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="showStatusModal = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {{ t('Cancel') }}
          </button>
          <button
            @click="confirmStatusUpdate"
            class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            {{ t('Update') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLanguageStore } from '@/stores/language'
import AdminSidebar from '@/components/Admin/AdminSidebar.vue'
import type { Order, OrderStatus } from '@/types'

const languageStore = useLanguageStore()
const { t, formatDate } = languageStore

// Orders data
const orders = ref<Order[]>([
  {
    id: '1',
    orderNumber: '1001',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890'
    },
    items: [
      {
        id: '1',
        name: 'Tom Ford Noir Extreme',
        image: 'https://images.unsplash.com/photo-1590736966894-cb4c52f4c4a9?w=500&fit=crop',
        price: 450,
        quantity: 1,
        size: '100ml',
        concentration: 'Eau de Parfum'
      },
      {
        id: '2',
        name: 'YSL Black Opium',
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&fit=crop',
        price: 380,
        quantity: 1,
        size: '90ml',
        concentration: 'Eau de Parfum'
      }
    ],
    subtotal: 830,
    shippingCost: 15,
    total: 845,
    status: 'pending',
    paymentMethod: 'Credit Card',
    shippingAddress: '123 Main St, New York, NY 10001',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '2',
    orderNumber: '1002',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1234567891'
    },
    items: [
      {
        id: '3',
        name: 'Versace Eros Flame',
        image: 'https://images.unsplash.com/photo-1611077640180-0ca237d2553d?w=500&fit=crop',
        price: 520,
        quantity: 2,
        size: '100ml',
        concentration: 'Eau de Parfum'
      }
    ],
    subtotal: 1040,
    shippingCost: 0,
    total: 1040,
    status: 'processing',
    paymentMethod: 'PayPal',
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-09')
  },
  {
    id: '3',
    orderNumber: '1003',
    customer: {
      name: 'Robert Johnson',
      email: 'robert@example.com',
      phone: '+1234567892'
    },
    items: [
      {
        id: '4',
        name: 'Chanel Coco Mademoiselle',
        image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500&fit=crop',
        price: 600,
        quantity: 1,
        size: '100ml',
        concentration: 'Eau de Parfum'
      }
    ],
    subtotal: 600,
    shippingCost: 10,
    total: 610,
    status: 'delivered',
    paymentMethod: 'Credit Card',
    shippingAddress: '789 Pine Rd, Chicago, IL 60601',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '4',
    orderNumber: '1004',
    customer: {
      name: 'Emily Davis',
      email: 'emily@example.com',
      phone: '+1234567893'
    },
    items: [
      {
        id: '5',
        name: 'Dior Sauvage Elixir',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&fit=crop',
        price: 550,
        quantity: 1,
        size: '100ml',
        concentration: 'Parfum'
      }
    ],
    subtotal: 550,
    shippingCost: 15,
    total: 565,
    status: 'shipped',
    paymentMethod: 'Credit Card',
    shippingAddress: '321 Maple St, Miami, FL 33101',
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-08')
  },
  {
    id: '5',
    orderNumber: '1005',
    customer: {
      name: 'Michael Wilson',
      email: 'michael@example.com',
      phone: '+1234567894'
    },
    items: [
      {
        id: '6',
        name: 'Gucci Bloom',
        image: 'https://images.unsplash.com/photo-1592948046993-4c0a3eb79b4c?w=500&fit=crop',
        price: 480,
        quantity: 1,
        size: '100ml',
        concentration: 'Eau de Parfum'
      }
    ],
    subtotal: 480,
    shippingCost: 0,
    total: 480,
    status: 'cancelled',
    paymentMethod: 'PayPal',
    shippingAddress: '654 Elm St, Dallas, TX 75201',
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-07')
  }
])

// Filters and search
const searchQuery = ref('')
const statusFilter = ref('')
const dateFilter = ref('')
const loading = ref(false)

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Modals
const selectedOrder = ref<Order | null>(null)
const showStatusModal = ref(false)
const orderToUpdate = ref<Order | null>(null)
const newStatus = ref<OrderStatus>('pending')
const trackingNumber = ref('')

// Computed properties
const filteredOrders = computed(() => {
  let filtered = [...orders.value]

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order =>
      order.orderNumber.toLowerCase().includes(query) ||
      order.customer.name.toLowerCase().includes(query) ||
      order.customer.email.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  // Apply date filter
  if (dateFilter.value) {
    const selectedDate = new Date(dateFilter.value)
    filtered = filtered.filter(order => {
      const orderDate = new Date(order.createdAt)
      return orderDate.toDateString() === selectedDate.toDateString()
    })
  }

  // Apply pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

const hasActiveFilters = computed(() => {
  return searchQuery.value || statusFilter.value || dateFilter.value
})

const totalPages = computed(() => {
  return Math.ceil(orders.value.length / itemsPerPage)
})

const pendingOrdersCount = computed(() => {
  return orders.value.filter(order => order.status === 'pending').length
})

const completedOrdersCount = computed(() => {
  return orders.value.filter(order => order.status === 'delivered').length
})

const totalRevenue = computed(() => {
  return orders.value
    .filter(order => order.status === 'delivered')
    .reduce((sum, order) => sum + order.total, 0)
})

// Methods
const getStatusClasses = (status: OrderStatus) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status]
}

const getStatusText = (status: OrderStatus) => {
  const texts = {
    pending: t('Pending'),
    processing: t('Processing'),
    shipped: t('Shipped'),
    delivered: t('Delivered'),
    cancelled: t('Cancelled')
  }
  return texts[status]
}

const viewOrder = (order: Order) => {
  selectedOrder.value = order
}

const updateStatus = (order: Order) => {
  orderToUpdate.value = order
  newStatus.value = order.status
  trackingNumber.value = ''
  showStatusModal.value = true
}

const confirmStatusUpdate = () => {
  if (!orderToUpdate.value) return

  // Update order status
  orderToUpdate.value.status = newStatus.value
  orderToUpdate.value.updatedAt = new Date()
  
  // Add tracking number if provided
  if (trackingNumber.value && (newStatus.value === 'shipped' || newStatus.value === 'delivered')) {
    // In real app, store tracking number
    console.log('Tracking number:', trackingNumber.value)
  }

  // Update in modal if open
  if (selectedOrder.value && selectedOrder.value.id === orderToUpdate.value.id) {
    selectedOrder.value.status = newStatus.value
  }

  // Close modal
  showStatusModal.value = false
  orderToUpdate.value = null
  newStatus.value = 'pending'
  trackingNumber.value = ''

  alert(t('Order status updated successfully!'))
}

const printInvoice = (order: Order) => {
  // In a real app, generate and print invoice
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${order.orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .info { display: flex; justify-content: space-between; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .total { text-align: right; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Invoice #${order.orderNumber}</h1>
            <p>Luxury Perfume Store</p>
            <p>Date: ${formatDate(order.createdAt)}</p>
          </div>
          
          <div class="info">
            <div>
              <h3>Customer Information</h3>
              <p>${order.customer.name}</p>
              <p>${order.customer.email}</p>
              <p>${order.customer.phone}</p>
              <p>${order.shippingAddress}</p>
            </div>
            <div>
              <h3>Order Information</h3>
              <p>Status: ${getStatusText(order.status)}</p>
              <p>Payment Method: ${order.paymentMethod}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}<br><small>${item.size} • ${item.concentration}</small></td>
                  <td>$${item.price.toFixed(2)}</td>
                  <td>${item.quantity}</td>
                  <td>$${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="total">Subtotal:</td>
                <td>$${order.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" class="total">Shipping:</td>
                <td>$${order.shippingCost.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="3" class="total">Total:</td>
                <td>$${order.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}

const exportOrders = () => {
  // Convert orders to CSV
  const headers = ['Order ID', 'Customer', 'Email', 'Phone', 'Date', 'Amount', 'Status', 'Payment Method']
  const csvData = orders.value.map(order => [
    order.orderNumber,
    order.customer.name,
    order.customer.email,
    order.customer.phone,
    formatDate(order.createdAt),
    `$${order.total.toFixed(2)}`,
    getStatusText(order.status),
    order.paymentMethod
  ])

  const csvContent = [
    headers.join(','),
    ...csvData.map(row => row.join(','))
  ].join('\n')

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `orders-${new Date().toISOString().split('T')[0]}.csv`)
  link.click()

  alert(t('Orders exported successfully!'))
}

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  dateFilter.value = ''
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Initialize
onMounted(() => {
  // In a real app, fetch orders from API
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
.shadow-luxury {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.transition-colors {
  transition: all 0.2s ease-in-out;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>