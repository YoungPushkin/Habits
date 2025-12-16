<template>
  <section class="settings app-page">
    <div class="page-header">
      <div class="page-title">
        <h1 class="t-h1">Settings</h1>
        <p class="t-subtitle">Personalize your experience and manage your account.</p>
      </div>
    </div>

    <v-row class="mt-2" dense>
      <v-col cols="12" md="6">
        <v-card class="hf-card" variant="tonal">
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="t-h2">Profile</div>
          </v-card-title>

          <v-divider />

          <v-card-text>
            <div class="d-flex align-center ga-3 mb-4">
              <v-avatar size="44" color="primary" variant="tonal">
                <span class="profile-avatar-text">HF</span>
              </v-avatar>

              <div class="min-w-0">
                <div class="t-body">{{ userName }}</div>
                <div class="t-caption">{{ userEmail }}</div>
              </div>
            </div>

            <v-btn variant="tonal" rounded="pill" @click="openChangePassword">
              Change password
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="hf-card" variant="tonal">
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="t-h2">Appearance</div>
          </v-card-title>

          <v-divider />

          <v-card-text>
            <div class="d-flex align-center justify-space-between ga-3 flex-wrap">
              <div>
                <div class="t-body">Theme</div>
                <div class="t-caption">Currently only dark mode available</div>
              </div>

              <v-chip size="small" variant="tonal" color="primary">Dark</v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="hf-card" variant="tonal">
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="t-h2">Notifications</div>
          </v-card-title>

          <v-divider />

          <v-card-text>
            <div class="d-flex align-center justify-space-between ga-3 flex-wrap">
              <div>
                <div class="t-body">Daily reminder</div>
                <div class="t-caption">Get a reminder to complete habits</div>
              </div>

              <v-switch
                :model-value="true"
                disabled
                inset
                hide-details
                color="primary"
              />
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card class="hf-card" variant="tonal">
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="t-h2">Danger zone</div>
          </v-card-title>

          <v-divider />

          <v-card-text>
            <div class="t-caption mb-4">This action is irreversible</div>

            <v-btn
              color="error"
              variant="tonal"
              rounded="pill"
              @click="confirmReset"
            >
              Reset all data
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showPasswordModal" max-width="560">
      <v-card class="hf-card" variant="tonal">
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="t-h2">Change password</div>
          <v-btn icon size="small" variant="tonal" @click="showPasswordModal = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text class="pt-4">
          <v-text-field
            v-model="newPassword"
            label="New password"
            type="password"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            class="mb-3"
          />

          <v-text-field
            v-model="confirmPassword"
            label="Confirm password"
            type="password"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            class="mb-3"
          />

          <v-alert
            v-if="passwordError"
            type="error"
            variant="tonal"
            density="comfortable"
          >
            {{ passwordError }}
          </v-alert>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4 d-flex justify-end ga-2">
          <v-btn variant="tonal" rounded="pill" @click="showPasswordModal = false">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="flat" rounded="pill" @click="changePassword">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showResetDialog" max-width="560">
      <v-card class="hf-card" variant="tonal">
        <v-card-title class="d-flex align-center justify-space-between">
          <div class="t-h2">Reset all data?</div>
          <v-btn icon size="small" variant="tonal" @click="showResetDialog = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-card-text>
          <div class="t-body mb-2">
            Are you sure? All habits and tasks will be deleted permanently.
          </div>
          <div class="t-caption">
            This cannot be undone.
          </div>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4 d-flex justify-end ga-2">
          <v-btn variant="tonal" rounded="pill" @click="showResetDialog = false">
            Cancel
          </v-btn>
          <v-btn color="error" variant="flat" rounded="pill" @click="resetAll">
            Reset
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </section>
</template>

<script>
import { useHabitsStore } from '../stores/habits'
import { useTasksStore } from '../stores/tasks'

export default {
  name: 'SettingsView',
  data() {
    return {
      showPasswordModal: false,
      showResetDialog: false,
      newPassword: '',
      confirmPassword: '',
      passwordError: ''
    }
  },
  computed: {
    userEmail() {
      return localStorage.getItem('current_user_email') || 'guest@example.com'
    },
    userName() {
      const raw = localStorage.getItem('current_user_name')
      if (raw) return raw
      const email = this.userEmail || ''
      return email.includes('@') ? email.split('@')[0] : 'User'
    }
  },
  methods: {
    openChangePassword() {
      this.showPasswordModal = true
      this.passwordError = ''
      this.newPassword = ''
      this.confirmPassword = ''
    },
    changePassword() {
      if ((this.newPassword || '').length < 6) {
        this.passwordError = 'Password must be at least 6 characters'
        return
      }
      if (this.newPassword !== this.confirmPassword) {
        this.passwordError = 'Passwords do not match'
        return
      }
      this.passwordError = ''
      this.showPasswordModal = false
      this.newPassword = ''
      this.confirmPassword = ''
    },
    confirmReset() {
      this.showResetDialog = true
    },
    resetAll() {
      const habitsStore = useHabitsStore()
      const tasksStore = useTasksStore()

      habitsStore.resetAll?.()

      if (Array.isArray(tasksStore.tasks)) tasksStore.tasks = []
      tasksStore.nextId = 1
      tasksStore.saveToStorage?.()

      this.showResetDialog = false
    }
  }
}
</script>

<style scoped>
.profile-avatar-text {
  font-weight: 800;
  letter-spacing: 0.08em;
}
</style>
