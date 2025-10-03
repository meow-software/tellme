# 1. Génère la migration
npx prisma migrate dev --name add_lang_constraint

# 2. (Optionnel) Si tu veux vérifier le SQL généré
npx prisma migrate diff --from-schema-datamodel prisma/schema.prisma --to-schema-datasource prisma/schema.prisma

# 3. Applique la migration
npx prisma migrate deploy

# 4. Met à jour le client Prisma
npx prisma generate