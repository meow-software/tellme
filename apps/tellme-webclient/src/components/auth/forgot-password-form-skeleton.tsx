import { Skeleton } from "@/components/ui/skeleton"

export function ForgotPasswordFormSkeleton() {
  return (
    <div className="space-y-4">
      {/* Champ email */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" /> {/* Label */}
        <Skeleton className="h-12 w-full rounded-md" /> {/* Input */}
      </div>

      {/* Bouton */}
      <Skeleton className="h-12 w-full rounded-full" />

      {/* Lien retour */}
      <div className="text-center">
        <Skeleton className="h-4 w-40 mx-auto" />
      </div>
    </div>
  )
}
