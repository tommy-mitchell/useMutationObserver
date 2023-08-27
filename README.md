# React hook use-mutation-observer

Performant react hook for WebApi Mutation Observer

## Installation

```bash
npm install @tommy-mitchell/react-use-mutation-observer
```

or

```bash
yarn add @tommy-mitchell/react-use-mutation-observer
```

## Example without value

```tsx
import React, { useState, useRef } from 'react'
import useMutationObserver from '@tommy-mitchell/react-use-mutation-observer'

const App = () => {
  const [target, setTarget] = useRef()
  const [changes, setChanges] = useState()

  useMutationObserver(target.current, (mutations, observer) => {
    const changes = mutations.map((mutation) => {
      return {
        type: mutation.type,
        target: mutation.target,
        attributeName: mutation.attributeName,
        oldValue: mutation.oldValue
      }
    })
    return setChanges(changes)
  })

  return (
    <div>
      <div ref={target}>Target</div>
      <div>Changes: {JSON.stringify(changes)}</div>
    </div>
  )
}
```

## Example with value

```tsx
import React, { useState, useRef } from 'react'
import useMutationObserver from '@tommy-mitchell/react-use-mutation-observer'

const App = () => {
  const [target, setTarget] = useRef()
  const [value, observer] = useMutationObserver(target.current, (mutation) => {
    const { type, target, attributeName, oldValue } = mutation
    return target.getAttribute(attributeName)
  })
}

return (
  <div>
    <div ref={target}>Target</div>
    <div>Changes: {JSON.stringify(value)}</div>
  </div>
)
```

## API

This package exposes one function, `useMutationObserver`, which runs a callback whenever a target element changes, passed in as a react ref.

By default, only changes to the target element attributes fire the callback. You can opt to pass in `options` configuration the third argument as needed. These options are the same as the [MutationObserverInit](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserverInit) interface.

```tsx
type MutationObserverOptions = {
  attributes?: boolean
  attributeOldValue?: boolean
  attributeFilter?: string[]
  characterData?: boolean
  characterDataOldValue?: boolean
  childList?: boolean
  subtree?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}
```

- **attributeFilter**: An array of specific attribute names to be monitored. If this property isn't included, changes to all attributes cause mutation notifications. No default value.

- **attributeOldValue**: Set to true to record the previous value of any attribute that changes when monitoring the node or nodes for attribute changes; see Monitoring attribute values in MutationObserver for details on watching for attribute changes and value recording. No default value.

- **attributes**: Set to true to watch for changes to the value of attributes on the node or nodes being monitored. The default value is false.

- **characterData**: Set to true to monitor the specified target node or subtree for changes to the character data contained within the node or nodes. No default value.

- **characterDataOldValue**: Set to true to record the previous value of a node's text whenever the text changes on nodes being monitored. For details and an example, see Monitoring text content changes in MutationObserver. No default value.

- **childList**: Set to true to monitor the target node (and, if subtree is true, its descendants) for the addition of new child nodes or removal of existing child nodes. The default is false.

- **subtree**: Set to true to extend monitoring to the entire subtree of nodes rooted at target. All of the other MutationObserverInit properties are then extended to all of the nodes in the subtree instead of applying solely to the target node. The default value is false.

### Returns

[value, observer]

## License

MIT  © [prma85](github.com/prma85)
