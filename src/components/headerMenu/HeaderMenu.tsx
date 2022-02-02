import React, { memo, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  Box,
  Button,
  LightMode,
  LinkProps,
  MenuItemProps,
  MenuButtonProps,
  ButtonProps,
  Portal,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  ModalHeader,
  useTheme,
} from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { GoRepo, GoArchive } from 'react-icons/go'
import { FaRegSave, FaBomb, FaEdit } from 'react-icons/fa'
import useDispatch from '~hooks/useDispatch'
import JSONTree from 'react-json-tree'
import { useSelector } from 'react-redux'
import { getShowLayout, getShowCode, getShowCustomThemeUpload } from '~core/selectors/app'

export const jsonTheme = {
  scheme: 'google',
  author: 'seth wright (http://sethawright.com)',
  base00: '#000',
  base01: '#282a2e',
  base02: '#373b41',
  base03: '#969896',
  base04: '#b4b7b4',
  base05: '#c5c8c6',
  base06: '#e0e0e0',
  base07: '#ffffff',
  base08: '#CC342B',
  base09: '#F96A38',
  base0A: '#FBA922',
  base0B: '#198844',
  base0C: '#3971ED',
  base0D: '#3971ED',
  base0E: '#A36AC7',
  base0F: '#3971ED',
}

type MenuItemLinkProps = MenuItemProps | LinkProps

// Ignore because of AS typing issues
// @ts-ignore
const MenuItemLink: React.FC<MenuItemLinkProps> = React.forwardRef(
  (props, ref: React.Ref<HTMLLinkElement>) => {
    // @ts-ignore
    return <MenuItem ref={ref} as="a" {...props} />
  },
)

// @ts-ignore
const CustomMenuButton: React.FC<
  MenuButtonProps | ButtonProps
> = React.forwardRef((props, ref: React.Ref<HTMLLinkElement>) => {
  // @ts-ignore
  return <MenuButton as={Button} {...props} />
})

const ExportMenuItem = dynamic(() => import('./ExportMenuItem'), { ssr: false })
const ImportMenuItem = dynamic(() => import('./ImportMenuItem'), { ssr: false })

const HeaderMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [fileLoaded, setFileLoaded] = useState(false)
  const [fileError, setFileError] = useState(false)
  const showCustomThemeUpload = useSelector(getShowCustomThemeUpload)
  const dispatch = useDispatch()
  const theme = useTheme()
  
  const handleChange = async (selectorFiles: any) => {
    selectorFiles.preventDefault()
    const reader = new FileReader()
    reader.onload = async e => {
      if (e.target!.result) {
        const text = e.target!.result
        // @ts-ignore
        //dispatch.app.getCustomTheme(JSON.parse(text))
        console.log(
          'stringify object is====',
          JSON.stringify(text).replace(/(?:\\[rn])+/g, ''),
        )
        localStorage.setItem('customTheme', JSON.stringify(text))
        setFileLoaded(true)
        dispatch.app.togglCustomThemeUploadMode()
      } else {
        setFileError(true)
      }
    }
    reader.readAsText(selectorFiles.target.files[0])
  }
  return (
    <Menu placement="bottom">
      <CustomMenuButton
        rightIcon={<ChevronDownIcon path="" />}
        size="xs"
        variant="ghost"
        colorScheme="gray"
      >
        Editor
      </CustomMenuButton>
      <Portal>
        <LightMode>
          <MenuList bg="white" zIndex={999}>
            {process.env.NEXT_PUBLIC_IS_V1 && (
              <MenuItemLink isExternal href="https://v0.UIGenerator.app">
                <Box mr={2} as={GoArchive} />
                Chakra v0 Editor
              </MenuItemLink>
            )}
            <ExportMenuItem />
            <ImportMenuItem />
            
            {showCustomThemeUpload && (
                    <MenuItem onClick={onOpen}>
                    <Box mr={2} as={FaEdit} />
                    Edit theme
                  </MenuItem>
                  )}
           

           
          </MenuList>
        </LightMode>
        <LightMode>
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
              <ModalOverlay />
              <ModalContent rounded={10}>
                <ModalHeader fontSize="15px" textAlign="center">
                  Add your custom JSON Theme Object
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Input
                    id="themeFile"
                    type="file"
                    accept="application/json"
                    onChange={(selectorFiles: any) =>
                      handleChange(selectorFiles)
                    }
                  />

                  {!showCustomThemeUpload && (
                    <div>
                      <p style={{ textAlign: 'center', marginTop: '20px' }}>
                        Your theme has been successfully loaded{' '}
                        <span
                          style={{ verticalAlign: 'middle' }}
                          role="img"
                          aria-label="light"
                        >
                          ✅
                        </span>
                      </p>
                    </div>
                  )}

                  {fileError && (
                    <p>
                      Can't read this file / theme{' '}
                      <span
                        style={{ verticalAlign: 'middle' }}
                        role="img"
                        aria-label="light"
                      >
                        ❌
                      </span>
                    </p>
                  )}
                 
                </ModalBody>

                <ModalFooter>
                  <Button mr={3} onClick={onClose} size="sm">
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </LightMode>
      </Portal>
    </Menu>
    
  )
}

export default memo(HeaderMenu)
