'use client'

// Compact variant picker — groups by attribute name, renders as small chips.
// Each chip shows the value; out-of-stock chips are muted + strikethrough.
// No headings, no descriptions, no big cards — just tight pill rows.

type Variant = {
   id: string
   stock: number
   attributes?: Record<string, string>   // e.g. { Color: "Black", Size: "M" }
   [key: string]: any
}

type Props = {
   product: any
   selectedVariant: Variant | null
   setSelectedVariant: (v: Variant | null) => void
}

export default function ProductVariants({ product, selectedVariant, setSelectedVariant }: Props) {
   const variants: Variant[] = product.variants ?? []
   if (!variants.length) return null

   // collect all attribute keys across all variants
   const attrKeys = Array.from(
      new Set(variants.flatMap((v) => Object.keys(v.attributes ?? {})))
   )

   // if no structured attributes, fall back to raw value field
   const hasAttrs = attrKeys.length > 0

   if (!hasAttrs) {
      // flat list of chips — use variant.value or variant.name as label
      return (
         <div className='flex flex-wrap gap-1'>
            {variants.map((v) => {
               const label = v.value ?? v.name ?? v.id
               const oos   = v.stock <= 0
               const sel   = selectedVariant?.id === v.id
               return (
                  <button
                     key={v.id}
                     disabled={oos}
                     onClick={() => setSelectedVariant(sel ? null : v)}
                     className={`h-6 px-2.5 rounded-full border text-[10px] font-medium transition-all
                        ${sel  ? 'bg-black text-white border-black'
                               : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}
                        ${oos  ? 'opacity-40 line-through cursor-not-allowed' : ''}`}
                  >
                     {label}
                  </button>
               )
            })}
         </div>
      )
   }

   // grouped by attribute key — one row of chips per attribute
   return (
      <div className='space-y-1.5'>
         {attrKeys.map((key) => {
            // unique values for this key
            const values = Array.from(new Set(variants.map((v) => v.attributes?.[key]).filter(Boolean))) as string[]

            return (
               <div key={key} className='flex items-center gap-1.5 flex-wrap'>
                  <span className='text-[10px] text-gray-400 w-10 shrink-0 capitalize'>{key}</span>
                  {values.map((val) => {
                     // find a matching variant (prefer one that also matches other selected attrs)
                     const matching = variants.filter((v) => v.attributes?.[key] === val)
                     const oos      = matching.every((v) => v.stock <= 0)
                     const sel      = selectedVariant?.attributes?.[key] === val

                     const pick = () => {
                        if (oos) return
                        // pick first in-stock variant with this value
                        const next = matching.find((v) => v.stock > 0) ?? matching[0]
                        setSelectedVariant(sel ? null : next)
                     }

                     return (
                        <button
                           key={val}
                           onClick={pick}
                           disabled={oos}
                           className={`h-6 px-2.5 rounded-full border text-[10px] font-medium transition-all
                              ${sel  ? 'bg-black text-white border-black'
                                     : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'}
                              ${oos  ? 'opacity-40 line-through cursor-not-allowed' : ''}`}
                        >
                           {val}
                        </button>
                     )
                  })}
               </div>
            )
         })}

         {/* selected variant stock hint */}
         {selectedVariant && (
            <p className='text-[10px] text-gray-400'>
               {selectedVariant.stock > 0
                  ? `${selectedVariant.stock} left`
                  : 'Out of stock'}
            </p>
         )}
      </div>
   )
}