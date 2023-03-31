<template>
  <MenuController
    ref="manuMenuController"
  />
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import MenuController from './components/MenuController.vue'
import { IMenu, IMenuController } from './components/Types'

/**
 * ! Test Menu
 */
const testMenu: IMenu = {
  title: 'ManuMenu',
  subtitle: 'Subtitle',
  selectedIndex: 3,
  highlightColor: '#14b8a6',
  items: [
    {
      name: 'Test Button',
      type: 'button'
    },
    {
      name: 'Test Input',
      type: 'input',
      inputTitle: 'Whats your favourite color?'
    },
    {
      name: 'Test Select',
      type: 'select',
      selectOptions: [
        'Item 1',
        'Item 2',
        'Item 3'
      ]
    },
    {
      name: 'Styled',
      type: 'button',
      leftIcon: 'arrow-right',
      rightIcon: 'check'
    }
  ]
}

export default defineComponent({
  components: { MenuController },
  mounted() {
    const menuController = this.$refs['manuMenuController'] as IMenuController
    menuController.openMenu(testMenu)
  }
})
</script>