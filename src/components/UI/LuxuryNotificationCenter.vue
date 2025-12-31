<template>
  <!-- Notification Container -->
  <div class="fixed z-[1000] pointer-events-none" :class="positionClass">
    <!-- Notification Items -->
    <transition-group
      name="notification"
      tag="div"
      class="space-y-3 p-4"
    >
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="pointer-events-auto"
      >
        <LuxuryNotificationItem
          :notification="notification"
          @close="removeNotification(notification.id)"
        />
      </div>
    </transition-group>
  </div>

  <!-- Confirmation Modal -->
  <LuxuryConfirmationModal
    v-if="confirmationData"
    :data="confirmationData"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import type { Notification, NotificationPosition, ConfirmationOptions } from '@/utils/notifications'
import { luxuryNotification } from '@/utils/notifications'
import LuxuryNotificationItem from './LuxuryNotificationItem.vue'
import LuxuryConfirmationModal from './LuxuryConfirmationModal.vue'

// Props
const props = withDefaults(
  defineProps<{
    position?: NotificationPosition
    maxNotifications?: number
  }>(),
  {
    position: 'top-right',
    maxNotifications: 5
  }
)

// State
const notifications = ref<Notification[]>([])
const confirmationData = ref<{
  options: ConfirmationOptions
  onConfirm: () => void
  onCancel: () => void
} | null>(null)

// Computed
const positionClass = computed(() => {
  const classes: Record<NotificationPosition, string> = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  }
  return classes[props.position]
})

// Methods
const removeNotification = (id: string | number) => {
  luxuryNotification.remove(id)
}

const handleConfirm = () => {
  if (confirmationData.value) {
    confirmationData.value.onConfirm()
    confirmationData.value = null
  }
}

const handleCancel = () => {
  if (confirmationData.value) {
    confirmationData.value.onCancel()
    confirmationData.value = null
  }
}

// Event Listeners
const handleConfirmationEvent = (event: CustomEvent) => {
  confirmationData.value = event.detail
}

// Lifecycle
onMounted(() => {
  // Subscribe to notifications
  const unsubscribe = luxuryNotification.subscribe((newNotifications) => {
    notifications.value = newNotifications.slice(0, props.maxNotifications)
  })

  // Listen for confirmation events
  window.addEventListener('luxury-confirmation', handleConfirmationEvent as EventListener)

  // Cleanup
  onUnmounted(() => {
    unsubscribe()
    window.removeEventListener('luxury-confirmation', handleConfirmationEvent as EventListener)
  })
})
</script>

<style scoped>
/* Notification transitions */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.notification-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.notification-leave-active {
  position: absolute;
}

.notification-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>