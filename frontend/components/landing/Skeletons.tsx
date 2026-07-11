'use client'

export function FeaturesSkeleton() {
  return (
    <div className="max-w-[1100px] mx-auto px-6 py-24 animate-pulse">
      <div className="mb-14">
        <div className="h-4 w-20 bg-border rounded mb-3" />
        <div className="h-10 w-80 bg-border rounded mb-4" />
        <div className="h-6 w-96 bg-border rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface border border-border rounded-2xl p-8 h-[220px]" />
        ))}
      </div>
    </div>
  )
}

export function PipelineSkeleton() {
  return (
    <div className="bg-surface border-t border-b border-border py-24 px-6 animate-pulse">
      <div className="max-w-[1000px] mx-auto">
        <div className="mb-14">
          <div className="h-4 w-32 bg-border rounded mb-3" />
          <div className="h-10 w-96 bg-border rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-border">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-8 h-[200px]" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function SecuritySkeleton() {
  return (
    <div className="max-w-[1100px] mx-auto px-6 py-24 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="h-4 w-32 bg-border rounded mb-3" />
          <div className="h-10 w-96 bg-border rounded mb-5" />
          <div className="h-16 w-full bg-border rounded mb-8" />
          <div className="flex flex-col gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 w-full bg-surface border border-border rounded-lg" />
            ))}
          </div>
        </div>
        <div className="bg-surface border border-border rounded-2xl h-[400px]" />
      </div>
    </div>
  )
}

export function FooterSkeleton() {
  return (
    <div className="border-t border-border py-16 px-6 bg-bg mt-12 animate-pulse">
      <div className="max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[150px] bg-surface rounded-xl" />
          ))}
        </div>
        <div className="border-t border-border pt-7 h-10 w-full bg-surface rounded" />
      </div>
    </div>
  )
}
