import React, { useState } from 'react'

const ImagePlaceHolder = ({
    size , small, onImageChange, onRemove, defaultImage = null , index = null , setOpenImageModal
} : {
    size : string,
    small : boolean,
    onImageChange : (file : File | null , index : number) => void,
    onRemove : (index : number ) => void,
    defaultImage? : null | string;
    setOpenImageModal : (openImageModal : boolean) => void,
    index? : any
}) => {
    const [imagePreview , setImagePreview] = useState<string | null >(defaultImage);

    const handleFileChange = (e : React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0] || null;
            setImagePreview(file ? URL.createObjectURL(file) : null);
            onImageChange(file, index!);
    }
    
  return (
    <div
        className={`relative ${small ? "h-[180px]" : "h-[450px]"} w-full cursor-pointer bg-gray-600  border border-gray-600 flex flex-col justify-center items-center rounded-lg `}
        onClick={() => setOpenImageModal(true)}
    >
        <input type="file" 
            accept='image/*'
            onChange={handleFileChange}
            className='hidden'
            id={`image-upload-${index}`}
        />
        {imagePreview ? (
            <img
                src={imagePreview}
                alt="Selected preview"
                className="absolute inset-0 h-full w-full rounded-lg object-cover"
            />
        ) : (
            <span className="text-white text-sm">Upload image</span>
        )}
    </div> 
  )
}

export default ImagePlaceHolder