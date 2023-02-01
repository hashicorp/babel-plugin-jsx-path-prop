/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: MPL-2.0
 */

function main() {
  return (
    <>
      <Foo />
      <Test something='something else' jsxProp={'wow'} />
      <Test path='files/example.txt' doge='wow' />
    </>
  )
}
