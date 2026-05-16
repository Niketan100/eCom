import React from 'react'

const Logo = ({width , height} : {width?: number, height?: number}) => {
  return (
    <svg width={width || "320"} height={height || "320"} viewBox="0 0 320 320" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="320" height="320" rx="40" fill="#0F172A"/>

  <circle cx="160" cy="160" r="90" fill="#1E293B"/>
  
  <path 
    d="M105 210L160 90L215 210H185L160 155L135 210H105Z" 
    fill="#38BDF8"
  />

  <circle cx="160" cy="160" r="22" fill="#F8FAFC"/>
  <path d="M85 245C120 215 200 215 235 245" 
    stroke="#A78BFA" 
    stroke-width="10" 
    stroke-linecap="round"
  />

  <circle cx="95" cy="95" r="10" fill="#F59E0B"/>
  <circle cx="225" cy="110" r="6" fill="#22C55E"/>
  <circle cx="240" cy="225" r="8" fill="#EF4444"/>
</svg>
  )
}

export default Logo