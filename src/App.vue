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
 * ! You can test here
 */
const testMenu: IMenu = {
  title: 'ManuMenu',
  subtitle: 'Subtitle',
  items: [...Array(56).keys()].map((e: number) => {
    return {
      name: `Item ${e}`,
      type: 'select',
      selectOptions: ['option A', 'option B', 'option C', 'option D']
    }
  })
}

export default defineComponent({
  components: { MenuController },
  mounted() {
    const menuController = this.$refs['manuMenuController'] as IMenuController
    menuController.openMenu(testMenu)
  }
})
</script>