import { useState, useRef } from 'react'

export default function PhotoUpload({ onPhoto }) {
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
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
    setIsDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const remove = () => {
    setPreview(null)
    onPhoto?.(null)
  }

  return (
    <div className="animate-fade-in">
      {preview ? (
        <div className="relative group rounded-2xl overflow-hidden">
          <img src={preview} alt="Issue" className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          <button onClick={remove}
            className="absolute top-3 right-3 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full text-white text-sm flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 active:scale-90">
            X
          </button>
        </div>
      ) : (
        <div onClick={() => fileRef.current?.click()}
          onDrop={handleDrop} onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          className={`flex flex-col items-center justify-center h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-civic-400 bg-civic-50 scale-[1.02]'
              : 'border-surface-300 hover:border-civic-400 hover:bg-civic-50/50 bg-surface-50'
          }`}>
          <span className="text-3xl mb-2">📷</span>
          <p className="text-sm text-surface-500 font-medium">Click or drag photo here</p>
          <p className="text-[10px] text-surface-400 mt-1">JPG, PNG up to 5MB</p>
        </div>
      )}
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={e => handleFile(e.target.files[0])} />
    </div>
  )
}
