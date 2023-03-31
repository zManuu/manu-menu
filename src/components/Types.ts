interface IMenu {
    title: string
    items: IMenuItem[]

    /**
     * Set it to 0 when initializing a menu.
     */
    selectedIndex: number

    subtitle?: string
    highlightColor?: string
}

interface IMenuItem {

    type: 'button' | 'input' | 'select'

    /**
     * Can be ignored for select inputs as the selected option will show up as the name. Just set it to an empty string in that case.
     */
    name: string

    /**
     * Will add a badge to the right (font-awesome).
     */
    rightIcon?: string

    /**
     * Will add a badge to the right (font-awesome).
     */
    leftIcon?: string

    /**
     * Applies only if type is set to 'select'.
     */
    selectOptions?: string[]

    /**
     * Applies only if type is set to 'select'.
     * Will be set automatically to the 1. selectOption on mount.
     */
    selectedOption?: string

    /**
     * Applies only if type is set to 'input'. After the item is clicked, an input field with open with this as a title.
     */
    inputTitle?: string

}

/**
 * If you are using this menu with alt:V, you don't need to touch the IMenuController.
 * However, if you are integrating the menu into your Vue Project, you'll be able to
 * hook into the MenuController.vue. Take a look at the App.vue
 */
interface IMenuController {
    openMenu(menu: IMenu): void
}

export {
    IMenu,
    IMenuItem,
    IMenuController
}