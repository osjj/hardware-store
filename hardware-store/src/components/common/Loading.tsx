interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export default function Loading({ size = 'md', text }: LoadingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        className={`${sizes[size]} border-4 border-gray-200 border-t-primary rounded-full animate-spin`}
      />
      {text && <p className="mt-2 text-gray-600">{text}</p>}
    </div>
  )
}
