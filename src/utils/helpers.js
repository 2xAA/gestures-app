export function splitarray(input, spacing) {
  const output = []
  for (let i = 0; i < input.length; i += spacing) {
    output[output.length] = input.slice(i, i + spacing)
  }
  return output
}

export function transposeArray(array, arrayLength) {
  const newArray = []
  for (let i = 0; i < array.length; i++) {
    newArray.push([])
  }

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < arrayLength; j++) {
      newArray[j].push(array[i][j])
    }
  }
  return newArray
}
