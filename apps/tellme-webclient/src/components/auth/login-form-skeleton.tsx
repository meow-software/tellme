import { Skeleton } from "@/components/ui/skeleton"

export function LoginFormSkeleton() {
  return (
    <div className="space-y-4">
      {/* Boutons sociaux */}
      <div className="flex-col gap-2">
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

      {/* Champ email */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" /> {/* Label */}
        <Skeleton className="h-12 w-full rounded-md" /> {/* Input */}
      </div>

      {/* Champ mot de passe */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>

      {/* Checkbox + lien oublié */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-sm" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-28" />
      </div>

      {/* Bouton login */}
      <Skeleton className="h-12 w-full rounded-full" />

      {/* Lien inscription */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}
