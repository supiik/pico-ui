<script setup lang="ts">
// Obsah ľavého menu – zdieľa ho trvalé menu (desktop) aj vysúvacie menu (mobil).
// `navigate` pri kliknutí na odkaz – vysúvacie menu sa ním zatvorí.
import { ExternalLink, LogOut } from '@lucide/vue'
import type { NavSection } from '../nav.ts'
import { pt } from '../messages.ts'

defineProps<{ sections: NavSection[]; user?: string }>()
const emit = defineEmits<{ navigate: []; logout: [] }>()

const linkClass =
  'flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground no-underline transition-colors hover:bg-accent hover:text-accent-foreground hover:no-underline'
const activeClass = 'bg-accent font-medium text-accent-foreground'
</script>

<template>
  <nav :aria-label="pt('mainMenu')" class="flex flex-1 flex-col overflow-y-auto px-2 py-3">
    <template v-for="(s, i) in sections" :key="i">
      <div v-if="i > 0" class="my-2 border-t" />
      <p v-if="s.title" class="px-3 pb-1 pt-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">{{ s.title }}</p>
      <a
        v-for="item in s.items"
        :key="item.href"
        :href="item.href"
        :class="[linkClass, item.current && activeClass]"
        :aria-current="item.current ? 'page' : undefined"
        :target="item.external ? '_blank' : undefined"
        :rel="item.external ? 'noopener' : undefined"
        @click="emit('navigate')"
      >
        <component :is="item.icon" v-if="item.icon" class="size-4 shrink-0" aria-hidden="true" />
        <span class="truncate">{{ item.label }}</span>
        <ExternalLink v-if="item.external" class="ml-auto size-3.5 shrink-0 opacity-60" :aria-label="pt('opensNewWindow')" />
      </a>
    </template>
    <div class="mt-auto space-y-0.5 border-t pt-2">
      <slot name="footer" />
      <p v-if="user" class="truncate px-3 py-2 text-sm font-medium" :title="user">{{ user }}</p>
      <button v-if="user" type="button" :class="[linkClass, 'w-full']" @click="emit('logout')">
        <LogOut class="size-4 shrink-0" aria-hidden="true" />{{ pt('logout') }}
      </button>
    </div>
  </nav>
</template>
