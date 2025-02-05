## Gestion des sous-modules Git

### 1. Récupérer les sous-modules après un clone  
Lorsque tu clones un dépôt qui contient des sous-modules, leur contenu n'est pas automatiquement téléchargé. Pour les récupérer, utilise :  
```sh
git submodule update --init --recursive
```

### 2. Synchroniser les URLs des sous-modules  
Si tu veux t'assurer que l'URL des sous-modules est bien synchronisée avec le fichier `.gitmodules`, exécute :  
```sh
git submodule sync --recursive
```

### 3. Mettre à jour les sous-modules  
Si les sous-modules ont changé dans leur propre dépôt, tu peux les mettre à jour avec :  
```sh
git submodule update --remote --merge
```
Cela va chercher les dernières modifications de la branche par défaut du sous-module et essayer de les fusionner.

### 4. Ajouter un nouveau sous-module  
Pour ajouter un sous-module, exécute :  
```sh
git submodule add https://github.com/meow-software/echo apps/echo
```
Si la commande réussit, cela mettra à jour le fichier `.gitmodules`.