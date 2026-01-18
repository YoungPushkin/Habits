<template>
  <v-menu >
    <template #activator="{ props }">
      <BaseButton v-bind="props" kind="icon" icon size="small">
        <i class="bi bi-three-dots-vertical"></i>
      </BaseButton>
    </template>

    <v-list density="comfortable" class="menu">
      <v-list-item v-if="showEdit" @click="$emit('edit')">
        <template #prepend>
          <i class="bi bi-pencil act-gold"></i>
        </template>
        <v-list-item-title>Edit</v-list-item-title>
      </v-list-item>

      <v-list-item v-if="showDelete" class="bad" @click="$emit('delete')">
        <template #prepend>
          <i class="bi bi-trash act-bad"></i>
        </template>
        <v-list-item-title>Delete</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import BaseButton from './BaseButton.vue'

export default {
  name: 'EditDeleteMenu',
  components: { BaseButton },
  props: {
    showEdit: { type: Boolean, default: true },
    showDelete: { type: Boolean, default: true }
  },
  emits: ['edit', 'delete']
}
</script>

<style scoped>
.menu{
  min-width:180px;
  border-radius:var(--r-md);
  border:1px solid var(--border2);
  background:rgba(11,11,11,.92);
  backdrop-filter:blur(14px);
}

.bad :deep(.v-list-item-title),
.bad i{
  color:#ef4444;
}
</style>
