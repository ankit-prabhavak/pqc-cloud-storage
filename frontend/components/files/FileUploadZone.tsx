'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload, FiFile, FiX } from 'react-icons/fi'

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

interface Props {
  file: File | null
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  error?: string
}

export default function FileUploadZone({ file, onFileSelect, onFileRemove, error }: Props) {
  const onDrop = useCallback((accepted: File[]) => {
    if (accepted.length > 0) onFileSelect(accepted[0])
  }, [onFileSelect])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 100 * 1024 * 1024,
    multiple: false,
    onDropRejected: () => {}
  })

  return (
    <div
      {...getRootProps()}
      style={{
        border: `2px dashed ${isDragActive ? '#111827' : file ? '#bbf7d0' : error ? '#fecaca' : '#e5e7eb'}`,
        borderRadius: 16,
        padding: '48px 32px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
        background: isDragActive ? '#f9fafb' : file ? '#f0fdf4' : '#fff'
      }}
    >
      <input {...getInputProps()} />

      {file ? (
        <div>
          <div style={{ width: 48, height: 48, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <FiFile size={22} color="#15803d" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 4 }}>{file.name}</p>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>{formatBytes(file.size)}</p>
          <button
            onClick={e => { e.stopPropagation(); onFileRemove() }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', border: '1px solid #e5e7eb', borderRadius: 6, background: '#fff', fontSize: 12, color: '#6b7280', cursor: 'pointer' }}
          >
            <FiX size={12} /> Remove file
          </button>
        </div>
      ) : (
        <div>
          <div style={{ width: 48, height: 48, background: '#f9fafb', border: '1px solid #f0f0f0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <FiUpload size={22} color="#9ca3af" />
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
            {isDragActive ? 'Drop it here' : 'Drop a file or click to browse'}
          </p>
          <p style={{ fontSize: 13, color: '#9ca3af' }}>Any file type · Max 100 MB</p>
        </div>
      )}
    </div>
  )
}