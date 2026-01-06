<script>
import settingsMixin from '../mixins/SettingsView.mixin'

export default {
  name: 'SettingsView',
  mixins: [settingsMixin]
}
</script>

<template>
  <section class="app-page">
    <div class="page-head">
      <div class="page-title">
        <h1 class="t-h1 text-gold">Settings</h1>
        <p class="t-sub text-gold">Personalize your experience and manage your account.</p>
      </div>
    </div>

    <v-row class="mt-2" dense align="stretch">
      <v-col cols="12" md="6" class="d-flex">
        <v-card class="card h-100 flex-grow-1" variant="tonal">
          <v-card-title>
            <div class="t-h2 text-silver">Profile</div>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div class="d-flex align-center ga-3 mb-4">
              <v-avatar size="48" color="primary" variant="tonal">
                <v-img v-if="ui.avatarDataUrl" :src="ui.avatarDataUrl" cover />
                <span v-else class="profile-avatar-text">{{ initials }}</span>
              </v-avatar>

              <div class="min-w-0">
                <div class="t-body">{{ userName }}</div>
                <div class="t-cap">{{ userEmail }}</div>
              </div>
            </div>

            <v-btn class="btn-primary" variant="flat" rounded="pill" @click="openChangePassword">
              Change password
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" class="d-flex">
        <v-card class="card h-100 flex-grow-1" variant="tonal">
          <v-card-title class="d-flex align-center justify-space-between">
            <div class="t-h2 text-silver">Avatar</div>

            <div class="d-flex ga-2">
              <v-btn class="btn-action" variant="tonal" rounded="pill" @click="pickAvatar">
                Upload
              </v-btn>
              <v-btn
                class="btn-action"
                color="error"
                variant="tonal"
                rounded="pill"
                :disabled="!ui.avatarDataUrl"
                @click="ui.clearAvatar()"
              >
                Remove
              </v-btn>
            </div>
          </v-card-title>

          <v-divider />

          <v-card-text>
            <div class="t-cap mb-3">Upload an image from your device. It will be shown everywhere.</div>

            <div class="d-flex align-center ga-3">
              <v-avatar size="64" color="primary" variant="tonal">
                <v-img v-if="ui.avatarDataUrl" :src="ui.avatarDataUrl" cover />
                <span v-else class="profile-avatar-text">{{ initials }}</span>
              </v-avatar>

              <div class="t-cap">Supported: JPG/PNG/WebP.</div>
            </div>

            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              style="display:none"
              @change="onAvatarFile"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" class="d-flex">
        <v-card class="card h-100 flex-grow-1 " variant="tonal">
          <v-card-title>
            <div class="t-h2 text-silver">Style</div>
          </v-card-title>

          <v-divider />

          <v-card-text>
            <div class="d-flex align-center justify-space-between ga-3 flex-wrap">
              <div>
                <div class="t-body">Accent</div>
                <div class="t-cap">Choose Gold or Silver style</div>
              </div>

              <v-btn-toggle
                :model-value="ui.accent"
                mandatory
                density="comfortable"
                @update:modelValue="ui.setAccent"
              >
                <v-btn value="gold" variant="tonal" class="btn-action">Gold</v-btn>
                <v-btn value="silver" variant="tonal" class="btn-action">Silver</v-btn>
              </v-btn-toggle>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6" class="d-flex">
        <v-card class="card h-100 flex-grow-1" variant="tonal">
          <v-card-title>
            <div class="t-h2 text-silver">Danger zone</div>
          </v-card-title>

          <v-divider />

          <v-card-text>
            <div class="t-cap mb-4">This action is irreversible</div>

            <v-btn class="btn-action" color="error" variant="tonal" rounded="pill" @click="confirmReset">
              Reset all data
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showPasswordModal" max-width="560">
      <v-card class="modal">
        <div class="modal-pad-title d-flex align-center justify-space-between">
          <div class="t-h2">Change password</div>
          <v-btn icon size="small" variant="tonal" class="icon-close" @click="showPasswordModal = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </div>

        <div class="modal-pad-body">
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

          <v-alert v-if="passwordError" type="error" variant="tonal" density="comfortable">
            {{ passwordError }}
          </v-alert>
        </div>

        <div class="modal-pad-actions d-flex justify-end">
          <v-btn class="btn-action" variant="tonal" rounded="pill" @click="showPasswordModal = false">
            Cancel
          </v-btn>
          <v-btn class="btn-primary" variant="flat" rounded="pill" @click="submitPasswordChange">
            Save
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-dialog v-model="showResetDialog" max-width="560">
      <v-card class="modal">
        <div class="modal-pad-title d-flex align-center justify-space-between">
          <div class="t-h2">Reset all data?</div>
          <v-btn icon size="small" variant="tonal" class="icon-close" @click="showResetDialog = false">
            <v-icon icon="mdi-close" />
          </v-btn>
        </div>

        <div class="modal-pad-body">
          <div class="t-body mb-2">Are you sure? All habits and tasks will be deleted permanently.</div>
          <div class="t-cap">This cannot be undone.</div>
        </div>

        <div class="modal-pad-actions d-flex justify-end">
          <v-btn class="btn-action" variant="tonal" rounded="pill" @click="showResetDialog = false">
            Cancel
          </v-btn>
          <v-btn class="btn-action" color="error" variant="flat" rounded="pill" @click="resetAll">
            Reset
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </section>
</template>



