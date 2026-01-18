<script>
import settingsMixin from '../mixins/SettingsView.mixin';
import BaseCard from '../components/global/BaseCard.vue';
import BaseModal from '../components/global/BaseModal.vue';
import PageHeader from '../components/global/PageHeader.vue';
import FormErrorAlert from '../components/form/FormErrorAlert.vue';
import BaseButton from '../components/global/BaseButton.vue';
import { BUTTON_LABELS } from '../constants/buttons.js';
import { ACCENT_OPTIONS } from '../constants/options.js';
import OptionToggle from '../components/global/OptionToggle.vue';



export default {
  name: 'SettingsView',
  mixins: [settingsMixin],
  components: { BaseCard, BaseModal, PageHeader, FormErrorAlert, BaseButton, OptionToggle },
  computed: {
    buttonLabels() { return BUTTON_LABELS },
    accentOptions() { return ACCENT_OPTIONS }
  }
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

        <BaseButton kind="primary" @click="openChangePassword">
          {{ buttonLabels.changePassword }}
        </BaseButton>
      </BaseCard>

      <BaseCard title="Avatar" card-class="h-100">
        <template #meta>
          <div class="d-flex ga-2">
            <BaseButton kind="action" @click="pickAvatar">
              {{ buttonLabels.upload }}
            </BaseButton>
            <BaseButton
              kind="action"
              color="error"
              :disabled="!ui.avatarDataUrl"
              @click="ui.clearAvatar()"
            >
              {{ buttonLabels.remove }}
            </BaseButton>
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

          <OptionToggle
            :model-value="ui.accent"
            :options="accentOptions"
            mandatory
            density="comfortable"
            variant="tonal"
            button-class="btn-action"
            @update:modelValue="ui.setAccent"
          />
        </div>
      </BaseCard>

      <BaseCard title="Danger zone" card-class="h-100">
        <div class="t-cap mb-4">This action is irreversible</div>

        <BaseButton kind="action" color="error" @click="confirmReset">
          {{ buttonLabels.resetAll }}
        </BaseButton>
      </BaseCard>
    </div>

    <BaseModal
      v-if="showPasswordModal"
      title="Change password"
      :max-width="560"
      :primary-label="buttonLabels.save"
      :secondary-label="buttonLabels.cancel"
      @primary="submitPasswordChange"
      @secondary="showPasswordModal = false"
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

    </BaseModal>

    <BaseModal
      v-if="showResetDialog"
      title="Reset all data?"
      :max-width="480"
      :primary-label="buttonLabels.reset"
      :secondary-label="buttonLabels.cancel"
      primary-kind="action"
      primary-color="error"
      primary-variant="flat"
      @primary="resetAll"
      @secondary="showResetDialog = false"
      @close="showResetDialog = false"
    >
      <div class="t-body mb-2">Are you sure? All habits and tasks will be deleted permanently.</div>
      <div class="t-cap">This cannot be undone.</div>

    </BaseModal>
  </section>
</template>
