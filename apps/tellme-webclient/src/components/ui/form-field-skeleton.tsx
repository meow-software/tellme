import { Skeleton } from "@/components/ui/skeleton"

interface FormFieldSkeletonProps {
  withPasswordToggle?: boolean  // si le champ doit afficher l'icône œil
}

export function FormFieldSkeleton({ withPasswordToggle = false }: FormFieldSkeletonProps) {
  return (
    <div className="mb-6 space-y-2">
      {/* Label */}
      <Skeleton className="h-4 w-28 rounded-md" />

      {/* Champ input */}
      <div className="relative">
        <Skeleton className="h-11 w-full rounded-md" />

        {withPasswordToggle && (
          <Skeleton className="h-5 w-5 rounded-full absolute right-3 top-1/2 -translate-y-1/2" />
        )}
      </div>
    </div>
  )
}