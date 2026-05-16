import { atom } from "jotai";

export type NavItemType = {
    title : string;
    href : string;
}

export const navItems : NavItemType[] =  [
    {
        title : "Home",
        href : '/'

    },
    {
        title : "Invertory",
        href : '/invertory'
    },
    {
        title : "Shops",
        href : '/shops'
    },
    {
        title : "Orders",
        href : "/orders"
    },
   
];

export const items : props[] = [
    {
        title : "DashBoard",
        icon : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.625V9.75M8.25 21h8.25" />
</svg>  ,
        isActive : false,
        href : '/dashboard',

    },
        
    
        
   
];

export interface props {
    title : string,
    icon : React.ReactNode,
    isActive : boolean,
    href : string
}

export interface manageShopItems {
    title : string,
    icon : React.ReactNode,
    isactive : boolean,
    href : string
}

export const manageShopItems : manageShopItems[] = [
    {
        title : "Inventory",
        icon : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.625V9.75M8.25 21h8.25" />
</svg> ,
        isactive : false,
        href : '/dashboard/inventory'
    },  
    {
        title : "Orders",
        icon : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 5.4v.9m0 1.8v.9M3 10.2v.9m0 1.8v.9M3 16.8v1.5M3 19.2v.9m0 .9v.9M12 5.4h8.25M12 10.2h8.25M12 16.8h8.25M12 19.2h8.25M5.4 4.2h.008v.008H5.4V4.2zm0 5.4h.008v.008H5.4V9.6zm0 5.4h.008v.008H5.4v-.008z" />
</svg> ,
        isactive : false,
        href : '/dashboard/orders'
    },
    {
        title : "Payments",
        icon   :  
        <svg 
  width="24" 
  height="24" 
  viewBox="0 0 24 24" 
  fill="none" 
  xmlns="http://www.w3.org/2000/svg"
>

  <rect 
    x="2" 
    y="5" 
    width="20" 
    height="18" 
    rx="3" 
    stroke="white" 
    stroke-width="2"
  />


  <line 
    x1="2" 
    y1="9" 
    x2="22" 
    y2="9" 
    stroke="white" 
    stroke-width="2"
  />

  <circle 
    cx="18" 
    cy="16" 
    r="1.5" 
    fill="black"
  />
</svg>,
        isactive : false,
        href : '/dashboard/payments'
    },  
    {
        title : "Complaints",
        icon : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 2h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
</svg> ,
        isactive : false,
        href : '/dashboard/complaints'
    }
]



export const products: props[] = [
    {
        title : "Add Product",
        icon : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg> ,
        isActive : false,
        href : '/dashboard/manage-products/create-product'
    },
        {
        title : "Manage Products",
        icon : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.244 2.118H6.874a2.25 2.25 0 01-2.244-2.118L4 7.5m16.25 0a2.25 2.25 0 012.244-2.118h.376c1.152 0 2.166-.26 2.166-1.152V4a2.25 2.25 0 00-2.166-2.118h-.376c-1.152 0-2.166.26-2.166 1.152v.33m-10.625 0a2.25 2.25 0 012.244-2.118h.376c1.152 0 2.166-.26 2.166-1.152V4a2.25 2.25 0 00-2.166-2.118h-.376c-1.152 0-2.166.26-2.166 1.152v.33" />
</svg> ,
        isActive : false,
        href : '/dashboard/manage-products'
    }
]

export const events : props[] = [
    {
        title : "Sales Events",
        icon : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
</svg> ,
        isActive : false,
        href : '/sales-events'
    },
    {
        title : "Promotions",
        icon : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
</svg> ,
        isActive : false,
        href : '/promotions'
    }
]


export const controllers : props[] = 
[
    {
        title : "Settings",
        icon : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2
.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
</svg> ,
        isActive : false,
        href : '/settings'
    },
    {
        title : "Support",
        icon : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M15 11.25a3 3 0 11-6 0 3 3 0 016 0z" />
</svg> ,
        isActive : false,
        href : '/support'
    },
    {
        title : "inbox",
        icon : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg> ,
            isActive : false,
            href : '/inbox'
    },
    {
        title : "Notifications",
        icon : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg> ,
        isActive : false, 
        href : '/notifications'
    }
]

export const activeSidebarAtom = atom<string>('/dashboard');


 