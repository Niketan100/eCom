'use client'

import React from 'react'

import DetailedProductLayoutLoading from './components/DetailedProductLayoutLoading'

// Route-level loading UI for /products/[slug]
// We render the detailed skeleton (it's a superset of the basic layout),
// so the page never looks empty while product data is loading.
const Loading = () => {
  return <DetailedProductLayoutLoading />
}

export default Loading
