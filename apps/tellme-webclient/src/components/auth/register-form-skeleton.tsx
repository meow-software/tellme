import { Skeleton } from "@/components/ui/skeleton"

export function RegisterFormSkeleton() {
  return (
    <div className="space-y-4">
      {/* Boutons sociaux (empilés) */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-10 w-full rounded-md mb-2" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Séparateur OR */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <Skeleton className="h-4 w-10 rounded-md" />
        </div>
      </div>

      {/* Pseudo */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" /> {/* label */}
        <Skeleton className="h-12 w-full rounded-md" /> {/* input */}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>

      {/* Bouton submit */}
      <Skeleton className="h-12 w-full rounded-full" />

      {/* Lien vers login */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}