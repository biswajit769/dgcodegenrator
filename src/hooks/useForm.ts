import { ChangeEvent, useCallback, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import useDispatch from './useDispatch'
import { getSelectedComponentId } from '~core/selectors/components'

function getBase64(file:any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export const useForm = () => {
  const dispatch = useDispatch()
  const componentId = useSelector(getSelectedComponentId)
  const [fileSelected, setFileSelected] = useState<File>()

  useEffect(() => {
    // Update the document title using the browser API

    if (fileSelected) {
      getBase64(fileSelected).then(
        data => {
          setValue(
            'src',
            data
          )
        }
      );
      
    }
  }, [fileSelected])

  const setValueFromEvent = ({
    target: { name, value },
  }: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setValue(name, value)
  }

  const setValue = useCallback(
    (name: string, value: any) => {
      dispatch.components.updateProps({
        id: componentId,
        name,
        value,
      })
    },
    [componentId, dispatch.components],
  )

  const handleImageChange = function(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files
    //console.log("input file list0======",fileList[0]);

    if (!fileList) return
    setFileSelected(fileList[0])
    //console.log("file selected",fileList[0]);
  }

  return { setValue, setValueFromEvent, handleImageChange }
}
