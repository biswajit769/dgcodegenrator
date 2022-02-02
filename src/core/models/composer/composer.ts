import { DEFAULT_PROPS } from '~utils/defaultProps'
import { generateId } from '~utils/generateId'

type AddNode = {
  type: ComponentType
  parent?: string
  props?: any
  rootParentType?: ComponentType
}

class Composer {
  components: IComponents = {}

  rootComponentType: ComponentType | undefined = undefined

  constructor(name?: ComponentType) {
    if (name) {
      this.rootComponentType = name
    }
  }

  addNode = ({
    type,
    parent = 'root',
    props = {},
    rootParentType,
  }: AddNode): string => {
    const id = generateId()

    if (parent === 'root' && !this.rootComponentType) {
      this.rootComponentType = type
    }
    const localRootParentType = rootParentType || this.rootComponentType

    let customThemeContainer : any;

    if (localStorage.getItem('customTheme')) {
      customThemeContainer = {
        ...DEFAULT_PROPS,
        ...(JSON.parse(
          JSON.parse(localStorage.getItem('customTheme') || '{}'),
        ) as {}),
      }
    } else {
      customThemeContainer = {
        ...DEFAULT_PROPS,
      }
    }

    const { form, ...defaultProps } = customThemeContainer[type] || {}

    this.components = {
      ...this.components,
      [id]: {
        children: [],
        type,
        parent,
        id,
        props: { ...defaultProps, ...props },
        rootParentType: localRootParentType,
      },
    }

    if (parent !== 'root' && this.components[parent]) {
      this.components[parent].children.push(id)
    }

    return id
  }

  getComponents() {
    return this.components
  }
}

export default Composer
