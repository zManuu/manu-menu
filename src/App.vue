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
      selectOptions: [
        {
          name: 'Geld',
          imgSrc: 'https://cdn-icons-png.flaticon.com/128/2704/2704332.png'
        },
        {
          name: 'Schaufel',
          imgSrc: 'https://cdn-icons-png.flaticon.com/128/1862/1862573.png'
        }
      ]
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