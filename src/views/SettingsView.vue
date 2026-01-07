<script>
import settingsMixin from '../mixins/SettingsView.mixin';
import BaseCard from '../components/global/BaseCard.vue';
import BaseModal from '../components/global/BaseModal.vue';
import PageHeader from '../components/global/PageHeader.vue';
import FormErrorAlert from '../components/form/FormErrorAlert.vue';



export default {
  name: 'SettingsView',
  mixins: [settingsMixin],
  components: { BaseCard, BaseModal, PageHeader, FormErrorAlert }
}
</script>

<template>
  <section class="settings app-page">
    <PageHeader title="Settings" subtitle="Personalize your experience and manage your account." />

    <div class="settings-grid">
      <BaseCard title="Profile" card-class="h-100">
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
      </BaseCard>

      <BaseCard title="Avatar" card-class="h-100">
        <template #meta>
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
        </template>

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
      </BaseCard>

      <BaseCard title="Style" card-class="h-100">
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
      </BaseCard>

      <BaseCard title="Danger zone" card-class="h-100">
        <div class="t-cap mb-4">This action is irreversible</div>

        <v-btn class="btn-action" color="error" variant="tonal" rounded="pill" @click="confirmReset">
          Reset all data
        </v-btn>
      </BaseCard>
    </div>

    <BaseModal
      v-if="showPasswordModal"
      title="Change password"
      :max-width="560"
      @close="showPasswordModal = false"
    >
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

      <FormErrorAlert :message="passwordError" />

      <template #actions>
        <v-btn class="btn-action" variant="tonal" rounded="pill" @click="showPasswordModal = false">
          Cancel
        </v-btn>
        <v-btn class="btn-primary" variant="flat" rounded="pill" @click="submitPasswordChange">
          Save
        </v-btn>
      </template>
    </BaseModal>

    <BaseModal
      v-if="showResetDialog"
      title="Reset all data?"
      :max-width="480"
      @close="showResetDialog = false"
    >
      <div class="t-body mb-2">Are you sure? All habits and tasks will be deleted permanently.</div>
      <div class="t-cap">This cannot be undone.</div>

      <template #actions>
        <v-btn class="btn-action" variant="tonal" rounded="pill" @click="showResetDialog = false">
          Cancel
        </v-btn>
        <v-btn class="btn-action" color="error" variant="flat" rounded="pill" @click="resetAll">
          Reset
        </v-btn>
      </template>
    </BaseModal>
  </section>
</template>
