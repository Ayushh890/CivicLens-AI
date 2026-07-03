import { useState, useRef } from 'react'

export default function PhotoUpload({ onPhoto }) {
  const [preview, setPreview] = useState(null)
  const fileRef = useRef()

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
      onPhoto?.(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const remove = () => {
    setPreview(null)
    onPhoto?.(null)
  }

  return (
    <div>
      {preview ? (
        <div className="relative">
          <img src={preview} alt="Issue" className="w-full h-48 object-cover rounded-xl border border-gray-700" />
          <button onClick={remove}
            className="absolute top-2 right-2 w-7 h-7 bg-red-600 hover:bg-red-500 rounded-full text-white text-sm flex items-center justify-center">
            X
          </button>
        </div>
      ) : (
        <div onClick={() => fileRef.current?.click()}
          onDrop={handleDrop} onDragOver={e => e.preventDefault()}
          className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-700 hover:border-civic-500 rounded-xl cursor-pointer transition-colors bg-gray-900/50">
          <span className="text-3xl mb-2">📷</span>
          <p className="text-sm text-gray-400">Click or drag photo here</p>
          <p className="text-[10px] text-gray-600 mt-1">JPG, PNG up to 5MB</p>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={e => handleFile(e.target.files[0])} />
    </div>
  )
}
