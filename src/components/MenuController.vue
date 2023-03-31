<template>
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
  <div
    v-else-if="menu && !selectedItem"
    class="fixed left-3 top-3 bg-gray-800 border-gray-700 border-2 rounded text-white w-[17.5rem] py-2 text-center select-none"
  >
    <h1
      class="text-lg"
    >
      {{ menu.title }}
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
        v-for="(item, index) in menu.items"
        :key="index"
        class="flex flex-row justify-around items-center"
        :style="getStyle(index)"
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
          <h1>{{ item.selectedOption }}</h1>
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
</template>
<script lang="ts">

import { defineComponent } from 'vue'
import { IMenu, IMenuItem } from './Types'

const SELECT_EMIT = 'select'

const KEYS = {
  ArrowLeft: 37,
  ArrowRight: 39,
  ArrowUp: 38,
  ArrowDown: 40,
  Enter: 13
}

export default defineComponent({
  data() {
    return {
      menu: undefined as IMenu | undefined,
      selectedItem: undefined as IMenuItem | undefined,
      input: undefined as string | undefined
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
      for (const item of menu.items) {
        if (item.type != 'select')
          continue

        if (!item.selectOptions) {
          console.error(`Item ${item} is of type select but has no selectOptions!`)
          continue
        }

        item.selectedOption = item.selectOptions[0]
      }
    },
    getStyle(index: number) {
      return this.menu?.selectedIndex == index
        ? `background: ${this.menu.highlightColor || '#64748b'};`
        : ''
    },
    getCrntItem() {
      if (!this.menu)
        return undefined
      return this.menu.items[this.menu.selectedIndex]
    },
    handleKeyEvent(ev: KeyboardEvent | number) {
      if (!this.menu)
        return

      const keyCode = typeof ev == 'number'
        ? ev
        : ev.keyCode

      // item won't be null due to check for menu
      // if there is a menu, there will always be a selected item
      const item = this.getCrntItem() as NonNullable<IMenuItem>

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
          break
        }
        case KEYS.ArrowUp: {
          if (this.menu.selectedIndex == 0)
            break
          
          this.menu.selectedIndex -= 1
          break
        }
        case KEYS.ArrowDown: {
          if (this.menu.selectedIndex == this.menu.items.length - 1)
            break
          
          this.menu.selectedIndex += 1
          break
        }
        case KEYS.Enter: {
          this.handleSelect(this.menu.items[this.menu.selectedIndex])
          break
        }
      }
    },
    emit(eventName: string, ...args: unknown[]) {
      // @ts-expect-error alt isn't available in plain html types
      window.alt?.emit(eventName, ...args)
    },
    handleSelect(item: IMenuItem) {
      switch (item.type) {
        case 'button':
          this.emit(SELECT_EMIT, item.name)
          break
        case 'select':
          this.emit(SELECT_EMIT, item.name, item.selectedOption)
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
      this.emit(SELECT_EMIT, this.selectedItem?.name, this.input)
      this.selectedItem = undefined
    }
  },
})
</script>