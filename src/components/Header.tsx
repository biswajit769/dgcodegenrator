import React, { memo, useState, useEffect } from 'react'
import {
  Box,
  Switch,
  Button,
  Flex,
  Link,
  Stack,
  FormLabel,
  DarkMode,
  FormControl,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  LightMode,
  PopoverFooter,
  Tooltip,
  HStack,
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
import {
  ExternalLinkIcon,
  SmallCloseIcon,
  CheckIcon,
  RepeatIcon,
} from '@chakra-ui/icons'
import { DiGithubBadge } from 'react-icons/di'
import {
  MdFormatAlignLeft,
  MdOutlineLogout,
  MdSettings
} from 'react-icons/md'
import { AiFillThunderbolt } from 'react-icons/ai'
import { buildParameters } from '~utils/codesandbox'
import { generateCode } from '~utils/code'
import useDispatch from '~hooks/useDispatch'
import { useSelector } from 'react-redux'
import { getComponents } from '~core/selectors/components'
import { getShowLayout, getShowCode, getShowCustomThemeUpload } from '~core/selectors/app'
import HeaderMenu from '~components/headerMenu/HeaderMenu'

const CodeSandboxButton = () => {
  const components = useSelector(getComponents)
  const [isLoading, setIsLoading] = useState(false)
  

  return (
    <Tooltip
      zIndex={100}
      hasArrow
      bg="yellow.100"
      aria-label="Builder mode help"
      label="Logout"
    >
      <Button
        onClick={async () => {
          // setIsLoading(true)
          // const code = await generateCode(components)
          // setIsLoading(false)
          // const parameters = buildParameters(code)

          // window.open(
          //   `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`,
          //   '_blank',
          // )
        }}
        isLoading={isLoading}
        variant="ghost"
        size="xs"
      >
        Logout
      </Button>
    </Tooltip>
  )
}

const ClearCustomThemeButton = () => {
  const components = useSelector(getComponents)
  const [isLoading, setIsLoading] = useState(false)
  const [hideLocalStorageClearButton, setHideLocalStorageClearButton] = useState(false)
  const showCustomThemeUpload = useSelector(getShowCustomThemeUpload)
  const dispatch = useDispatch()

  if (typeof window !== 'undefined' && localStorage.getItem('customTheme')) {
    return (
      <Tooltip
        zIndex={100}
        hasArrow
        bg="yellow.100"
        aria-label="Builder mode help"
        label="Clear Imported Theme"
      >
        <Button
          onClick={() => {
            //localStorage.clear()
            //window.location.reload()
            setHideLocalStorageClearButton(true);
            localStorage.removeItem("customTheme");
            dispatch.app.togglCustomThemeUploadMode()
            //window.location.reload();
          }}
          rightIcon={<RepeatIcon path="" />}
          variant="ghost"
          size="xs"
        >
          Clear Custom Theme
        </Button>
      </Tooltip>
    )
  } else {
    return null
  }
}
const Header = () => {
  const showLayout = useSelector(getShowLayout)
  const showCode = useSelector(getShowCode)
  const dispatch = useDispatch()

  return (
    <DarkMode>
      <Flex
        justifyContent="space-between"
        bg="#1a202c"
        as="header"
        height="3rem"
        px="1rem"
      >
        <Flex
          width="14rem"
          height="100%"
          backgroundColor="#1a202c"
          color="white"
          as="a"
          fontSize="xl"
          flexDirection="row"
          alignItems="center"
          aria-label="Chakra UI, Back to homepage"
        >
          
          <Box fontWeight="bold">ui</Box>generator
        </Flex>

        <Flex flexGrow={1} justifyContent="space-between" alignItems="center">
          <HStack spacing={4} justify="center" align="center">
            <Box>
              <HeaderMenu />
            </Box>
            <FormControl flexDirection="row" display="flex" alignItems="center">
              <Tooltip
                zIndex={100}
                hasArrow
                bg="yellow.100"
                aria-label="Builder mode help"
                label="Builder mode adds extra padding/borders"
              >
                <FormLabel
                  cursor="help"
                  color="gray.200"
                  fontSize="xs"
                  htmlFor="preview"
                  pb={0}
                  mb={0}
                  mr={2}
                  whiteSpace="nowrap"
                >
                  Builder mode
                </FormLabel>
              </Tooltip>
              <LightMode>
                <Switch
                  isChecked={showLayout}
                  colorScheme="teal"
                  size="sm"
                  onChange={() => dispatch.app.toggleBuilderMode()}
                  id="preview"
                />
              </LightMode>
            </FormControl>

            <FormControl display="flex" flexDirection="row" alignItems="center">
              <FormLabel
                color="gray.200"
                fontSize="xs"
                mr={2}
                mb={0}
                htmlFor="code"
                pb={0}
                whiteSpace="nowrap"
              >
                Code panel
              </FormLabel>
              <LightMode>
                <Switch
                  isChecked={showCode}
                  id="code"
                  colorScheme="teal"
                  onChange={() => dispatch.app.toggleCodePanel()}
                  size="sm"
                />
              </LightMode>
            </FormControl>
          </HStack>

          <Stack direction="row">
            <CodeSandboxButton />
            <ClearCustomThemeButton />
            <Popover>
              {({ onClose }) => (
                <>
                  <PopoverTrigger>
                    <Button
                      ml={4}
                      rightIcon={<SmallCloseIcon path="" />}
                      size="xs"
                      variant="ghost"
                    >
                      Clear editor
                    </Button>
                  </PopoverTrigger>
                  <LightMode>
                    <PopoverContent zIndex={100} bg="white">
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Are you sure?</PopoverHeader>
                      <PopoverBody fontSize="sm">
                        Do you really want to remove all components on the
                        editor?
                      </PopoverBody>
                      <PopoverFooter display="flex" justifyContent="flex-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          rightIcon={<CheckIcon path="" />}
                          onClick={() => {
                            dispatch.components.reset()
                            if (onClose) {
                              onClose()
                            }
                          }}
                        >
                          Yes, clear
                        </Button>
                      </PopoverFooter>
                    </PopoverContent>
                  </LightMode>
                </>
              )}
            </Popover>
          </Stack>
        </Flex>

        
      </Flex>
    </DarkMode>
  )
}

export default memo(Header)
