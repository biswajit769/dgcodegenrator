import React, { memo } from 'react'
import TextControl from '~components/inspector/controls/TextControl'
import ColorsControl from '~components/inspector/controls/ColorsControl'

const BorderPanel = () => {
  return (
    <>
      <TextControl name="border" label="Border" />
      <ColorsControl withFullColor enableHues label="Border Color" name="borderColor" />
      <TextControl name="borderRadius" label="Border radius" />
    </>
  )
}

export default memo(BorderPanel)
