import { useRef } from "react"
import styled from "styled-components"
import { useStore } from "state/store"

function OutputText() {
  const clientsArr = useStore((state) => state.clientsArr)
  let textFile = null

  const linkRef = useRef()

  const makeTextFile = (text) => {
    var data = new Blob([text], { type: "text/plain" })

    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile)
    }

    textFile = window.URL.createObjectURL(data)
    return textFile
  }

  const handleSaveClick = (data) => {
    linkRef.current.href = makeTextFile(data)
  }

  return (
    <>
      <DownloadButton ref={linkRef} download="info.txt" />
      <SaveButton onClick={() => handleSaveClick(clientsArr)}>SAVE</SaveButton>
    </>
  )
}

export default OutputText

const SaveButton = styled.a`
  position: absolute;
  left: 0;
  width: 50px;
  height: 50px;
  flex: 1;
  z-index: 10;
  background-color: blue;
`
const DownloadButton = styled.a`
  position: absolute;
  left: 50px;
  width: 50px;
  height: 50px;
  flex: 1;
  z-index: 10;
  background-color: hotpink;
`
