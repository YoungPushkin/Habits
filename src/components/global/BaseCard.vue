<template>
  <v-card :class="['card', cardClass]" variant="tonal" elevation="0">
    <template v-if="hasHeader">
      <v-card-title :class="['d-flex align-center w-100', headerJustify]">
        <template v-if="$slots.header">
          <slot name="header" />
        </template>

        <template v-else-if="$slots.title">
          <div class="w-100">
            <slot name="title" />
          </div>
        </template>

        <template v-else>
          <div class="card-title">
            <div v-if="title" class="t-label">{{ title }}</div>
            <p v-if="subtitle" class="t-sub">{{ subtitle }}</p>
          </div>

          <div v-if="hasMeta" class="card-meta">
            <slot name="meta">
              <slot name="title-actions">
                <span class="t-cap" v-if="meta">{{ meta }}</span>
              </slot>
            </slot>
          </div>
        </template>
      </v-card-title>
      <v-divider v-if="!hideHeaderDivider" />
    </template>

    <v-card-text :class="['card-body', bodyClass]">
      <slot />
    </v-card-text>

    <template v-if="$slots.actions">
      <v-divider v-if="!hideActionsDivider" />
      <v-card-actions :class="['d-flex', actionsJustify, actionsClass]">
        <slot name="actions" />
      </v-card-actions>
    </template>
  </v-card>
</template>

<script>
export default {
  name: 'BaseCard',
  props: {
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    meta: { type: [String, Number], default: '' },
    cardClass: { type: [String, Array, Object], default: '' },
    bodyClass: { type: [String, Array, Object], default: '' },
    actionsClass: { type: [String, Array, Object], default: '' },
    hideHeaderDivider: { type: Boolean, default: false },
    hideActionsDivider: { type: Boolean, default: false },
    metaAlign: {
      type: String,
      default: 'between',
      validator: v => ['start', 'center', 'end', 'between'].includes(v)
    },
    actionsAlign: {
      type: String,
      default: 'end',
      validator: v => ['start', 'center', 'end', 'between'].includes(v)
    }
  },
  computed: {
    hasHeader() {
      return !!this.title || !!this.subtitle || !!this.meta || !!this.$slots.header || !!this.$slots.title || !!this.$slots.meta || !!this.$slots['title-actions']
    },
    hasMeta() {
      return !!this.meta || !!this.$slots.meta || !!this.$slots['title-actions']
    },
    headerJustify() {
      switch (this.metaAlign) {
        case 'start': return 'justify-start'
        case 'center': return 'justify-center'
        case 'end': return 'justify-end'
        default: return 'justify-space-between'
      }
    },
    actionsJustify() {
      switch (this.actionsAlign) {
        case 'start': return 'justify-start'
        case 'center': return 'justify-center'
        case 'between': return 'justify-space-between'
        default: return 'justify-end'
      }
    }
  }
}
</script>
