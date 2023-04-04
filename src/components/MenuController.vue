<template>
  <!-- input -->
  <div
    v-if="selectedItem"
    class="flex justify-center items-center w-screen h-screen bg-black bg-opacity-50"
  >
    <div
      class="bg-gray-800 border-gray-700 border-2 rounded select-none text-white p-2"
    >
      <h1>{{ selectedItem.name }}</h1>
      <input
        ref="input"
        v-model="input"
        class="w-[10rem] bg-gray-700 border-gray-600 border-2 rounded px-2 py-1 outline-none"
        :placeholder="selectedItem.name"
      >
    </div>
  </div>
  <!-- menu -->
  <div
    v-else-if="menu && !selectedItem"
  >
    <div
      class="fixed left-3 top-3 text-white select-none"
    >
      <div
        class="bg-gray-800 border-gray-700 border-2 rounded w-[17.5rem] py-2 text-center"
      >
        <h1
          class="text-lg"
        >
          {{ getTitle() }}
        </h1>
        <h1
          v-if="menu.subtitle"
          class="text-gray-400 italic"
        >
          {{ menu.subtitle }}
        </h1>
        <div
          class="flex flex-col mt-2"
        >
          <div
            v-for="item in getVisibleItems()"
            :key="item.id"
            class="flex flex-row justify-around items-center"
            :style="getStyle(item)"
          >
            <icon
              v-if="item.leftIcon"
              :icon="item.leftIcon"
            />
            <div
              v-if="item.type == 'select'"
              class="flex flex-row items-center gap-3"
            >
              <icon icon="arrow-left" />
              <h1>
                {{ typeof item.selectedOption == 'string'
                  ? item.selectedOption
                  : item.selectedOption?.name }}
              </h1>
              <icon icon="arrow-right" />
            </div>
            <h1
              v-else
            >
              {{ item.name }}
            </h1>
            <icon
              v-if="item.rightIcon"
              :icon="item.rightIcon"
            />
          </div>
        </div>
      </div>
      <!-- preview image -->
      <div
        v-if="menu && menu.selected && menu.selected.type == 'select' && menu.selected.selectedOption && typeof menu.selected.selectedOption == 'object' && menu.selected.selectedOption.imgSrc"
        class="max-w-full p-5 m-auto bg-gray-800 border-gray-700 rounded border-2 mt-3 flex flex-col items-center"
      >
        <h1>Vorschau: {{ menu.selected.selectedOption.name }}</h1>
        <img
          class="max-w-[50%]"
          :src="menu.selected.selectedOption.imgSrc"
        >
      </div>
    </div>
    <!-- keys -->
    <div
      class="fixed right-3 top-3 text-white select-none bg-gray-800 border-gray-700 border-2 rounded p-2"
    >
      <div
        v-for="(item, index) in keyControls"
        :key="index"
        class="flex justify-between items-center gap-5"
      >
        <h1>{{ item.key }}</h1>
        <h1
          class="text-gray-400 italic"
        >
          {{ item.text }}
        </h1>
      </div>
    </div>
  </div>
</template>
<script lang="ts">

import { defineComponent } from 'vue'
import { IMenu, IMenuItem } from './Types'

const MAX_ITEMS = 20

const EMITS = {
  SELECT: 'select',
  HOVER: 'hover',
  CHANGESELECTION: 'changeselection',
  CHANGESITE: 'changesite'
}

const KEYS = {
  ArrowLeft: 37,
  ArrowRight: 39,
  ArrowUp: 38,
  ArrowDown: 40,
  Enter: 13,
  PageUp: 33,
  PageDown: 34
}

export default defineComponent({
  data() {
    return {
      menu: undefined as IMenu | undefined,
      selectedItem: undefined as IMenuItem | undefined,
      input: undefined as string | undefined,
      page: 0,
      keyControls: [
        { key: 'Pfeil hoch', text: 'Letztes item (hoch)' },
        { key: 'Pfeil runter', text: 'Nächstes item (runter)' },
        { key: 'Pfeil links', text: 'Letzte option (links)' },
        { key: 'Pfeil rechts', text: 'Nächste option (rechts)' },
        { key: 'Enter', text: 'Item auswählen' },
        { key: 'Seite hoch', text: 'Letzte Seite' },
        { key: 'Seite runter', text: 'Nächste Seite' }
      ]
    }
  },
  mounted() {
    if ('alt' in window)
      //@ts-expect-error alt isn't available in plain html types
      window.alt.on('keyup', this.handleKeyEvent)
    else
      window.addEventListener('keyup', this.handleKeyEvent)
  },
  unmounted() {
    if ('alt' in window)
      //@ts-expect-error alt isn't available in plain html types
      window.alt.off('keyup', this.handleKeyEvent)
    else
      window.removeEventListener('keyup', this.handleKeyEvent)
  },
  methods: {
    openMenu(menu: IMenu) {
      this.menu = menu

      // set default options for select items
      for (let i=0; i<this.menu.items.length; i++) {
        const item = this.menu.items[i]

        item.id = i

        if (item.type != 'select')
          continue

        if (!item.selectOptions) {
          console.error(`Item ${item} is of type select but has no selectOptions!`)
          continue
        }

        item.selectedOption = item.selectOptions[0]
      }

      menu.selected = menu.items[0]
    },
    getPages() {
      return !this.menu
        ? 0
        : Math.round(this.menu.items.length / MAX_ITEMS)
    },
    getTitle() {
      return !this.menu
        ? ''
        : this.menu.items.length <= MAX_ITEMS
          ? this.menu.title
          : `${this.menu.title} (${this.page + 1}/${this.getPages()})`
    },
    getVisibleItems(): IMenuItem[] {
      if (!this.menu
        || this.menu.items.length == 0)
        return []

      if (this.menu.items.length <= MAX_ITEMS)
        return this.menu.items

      const r = [] as IMenuItem[]
      for (let i=0; i<MAX_ITEMS; i++) {
        const index = i + this.page * MAX_ITEMS
        if (index >= this.menu.items.length)
          break
        r.push(this.menu.items[index])
      }
      return r
    },
    getStyle(item: IMenuItem) {
      return this.menu?.selected == item
        ? `background: ${this.menu.highlightColor || '#64748b'};`
        : ''
    },
    handleKeyEvent(ev: KeyboardEvent | number) {
      if (!this.menu
        || !this.menu.selected)
        return

      const keyCode = typeof ev == 'number'
        ? ev
        : ev.keyCode

      // item won't be null due to check for menu
      // if there is a menu, there will always be a selected item
      const item = this.menu.selected as NonNullable<IMenuItem>

      switch (keyCode) {
        case KEYS.ArrowLeft: {
          if (item.type != 'select'
            || !item.selectedOption
            || !item.selectOptions)
            break
          
          const crntIndex = item.selectOptions.indexOf(item.selectedOption)

          if (crntIndex == 0)
            break

          item.selectedOption = item.selectOptions[crntIndex - 1]

          this.emit(
            EMITS.CHANGESELECTION,
            'left',
            crntIndex - 1,
            item.name,
            typeof item.selectedOption == 'string'
              ? item.selectedOption
              : item.selectedOption?.name
          )
          break
        }
        case KEYS.ArrowRight: {
          if (item.type != 'select'
            || !item.selectedOption
            || !item.selectOptions)
            break
          
          const crntIndex = item.selectOptions.indexOf(item.selectedOption)

          if (crntIndex == item.selectOptions.length - 1)
            break

          item.selectedOption = item.selectOptions[crntIndex + 1]

          this.emit(
            EMITS.CHANGESELECTION,
            'right',
            crntIndex + 1,
            item.name,
            typeof item.selectedOption == 'string'
              ? item.selectedOption
              : item.selectedOption?.name
          )
          break
        }
        case KEYS.ArrowUp: {
          const visibleItems = this.getVisibleItems()
          const firstItemOnPage = visibleItems[0]

          if (this.menu.selected == firstItemOnPage)
            break
          
          this.menu.selected = visibleItems[visibleItems.indexOf(this.menu.selected) - 1]

          this.emit(
            EMITS.HOVER,
            this.menu.selected.name
          )
          break
        }
        case KEYS.ArrowDown: {
          const visibleItems = this.getVisibleItems()
          const lastItemOnPage = visibleItems[visibleItems.length - 1]

          if (this.menu.selected == lastItemOnPage)
            break
          
          this.menu.selected = visibleItems[visibleItems.indexOf(this.menu.selected) + 1]

          this.emit(
            EMITS.HOVER,
            this.menu.selected.name
          )
          break
        }
        case KEYS.Enter: {
          this.handleSelect(this.menu.selected)
          break
        }
        case KEYS.PageUp: {
          if (this.getPages() < 2
            || this.page == this.getPages() - 1)
            return
          
          this.page++
          this.menu.selected = this.getVisibleItems()[0]

          this.emit(EMITS.CHANGESITE, 'up', this.page)
          break
        }
        case KEYS.PageDown: {
          if (this.getPages() < 2
            || this.page == 0)
            return
          
          this.page--
          this.menu.selected = this.getVisibleItems()[this.getVisibleItems().length - 1]

          this.emit(EMITS.CHANGESITE, 'down', this.page)
          break
        }
      }
    },
    emit(eventName: string, ...args: unknown[]) {
      if ('alt' in window) {
        // @ts-expect-error alt isn't available in plain html types
        window.alt?.emit(eventName, ...args)
      } else {
        console.log(`[EMIT] ${eventName}: ${args.join(',')}`)
      }
    },
    handleSelect(item: IMenuItem) {
      switch (item.type) {
        case 'button':
          this.emit(EMITS.SELECT, item.name)
          break
        case 'select':
          this.emit(
            EMITS.SELECT,
            item.name,
            typeof item.selectedOption == 'string'
              ? item.selectedOption
              : item.selectedOption?.name
          )
          break
        case 'input':
          if (this.selectedItem) {
            this.handleInputSubmit()
          } else {
            this.selectedItem = item
            this.$nextTick(() => {
              // @ts-expect-error vue doesn't recognice refs
              this.$refs['input'].focus()
            })
          }
          break
      }
    },
    handleInputSubmit() {
      this.emit(EMITS.SELECT, this.selectedItem?.name, this.input)
      this.selectedItem = undefined
      this.input = undefined
    }
  },
})
</script>