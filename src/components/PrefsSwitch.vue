<script setup lang="ts">
// Prepínač jazyka (SK / EN) a témy (svetlá → tmavá → podľa zariadenia). V AppShell je v pätičke menu;
// dá sa vložiť aj inam (napr. na prihlasovaciu obrazovku). Voľba sa pamätá a prenáša do ďalších aplikácií (prefs.ts).
import { computed } from 'vue'
import { Monitor, Moon, Sun } from '@lucide/vue'
import { Button } from '../ui/button'
import { colorTheme, nextColorTheme, setColorTheme } from '../colorTheme.ts'
import { LOCALE_NAMES, LOCALES, locale, setLocale } from '../locale.ts'
import { pt } from '../messages.ts'
import '../prefs.ts'

/** languages = false: len prepínač témy (aplikácia len v jednom jazyku, napr. Sharpn) */
const props = withDefaults(defineProps<{ languages?: boolean }>(), { languages: true })

const themeLabel = computed(() => pt(colorTheme.value === 'light' ? 'themeLight' : colorTheme.value === 'dark' ? 'themeDark' : 'themeSystem'))
const themeIcon = computed(() => (colorTheme.value === 'light' ? Sun : colorTheme.value === 'dark' ? Moon : Monitor))
</script>

<template>
  <div class="flex items-center gap-1 px-1">
    <div v-if="props.languages" role="group" :aria-label="pt('language')" class="flex rounded-md border p-0.5">
      <button
        v-for="l in LOCALES" :key="l" type="button" :lang="l" :title="LOCALE_NAMES[l]" :aria-pressed="locale === l"
        class="rounded px-2 py-0.5 text-xs font-medium uppercase text-muted-foreground hover:text-foreground aria-pressed:bg-accent aria-pressed:text-accent-foreground"
        @click="setLocale(l)"
      >{{ l }}</button>
    </div>
    <Button
      type="button" variant="ghost" size="icon-sm" class="ml-auto"
      :aria-label="pt('themeSwitch', { current: themeLabel })" :title="themeLabel"
      @click="setColorTheme(nextColorTheme(colorTheme))"
    >
      <component :is="themeIcon" aria-hidden="true" />
    </Button>
  </div>
</template>
