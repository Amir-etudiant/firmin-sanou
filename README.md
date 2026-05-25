# Site de Firmin Sanou — Sculpteur Fondeur

Nouveau site pour Firmin Sanou (sculpteur fondeur burkinabé).
Site statique, hébergé gratuitement, avec une interface d'administration accessible à Firmin pour ajouter ses œuvres et expositions sans toucher au code.

---

## 📁 Ce que contient le projet

```
firmin-sanou/
├── index.html              ← Page d'accueil
├── portrait.html           ← Biographie + parcours
├── oeuvres.html            ← Galerie complète (dynamique)
├── technique.html          ← La cire perdue
├── stages.html             ← Stages + fonderie d'art
├── contact.html            ← Contact + partenaires
├── admin/                  ← Interface d'administration de Firmin
│   ├── index.html
│   └── config.yml
├── data/                   ← Données éditables via l'admin
│   ├── oeuvres.json
│   ├── expositions.json
│   ├── partenaires.json
│   └── settings.json
├── images/
│   ├── oeuvres/            ← Photos des sculptures
│   ├── expositions/        ← Affiches d'expos
│   ├── partenaires/        ← Logos partenaires
│   ├── divers/             ← Portrait, atelier, etc.
│   └── uploads/            ← (créé automatiquement quand Firmin ajoute des photos)
├── netlify.toml            ← Configuration Netlify
└── README.md               ← Ce fichier
```

---

## 🚀 Déploiement sur Netlify (15 minutes)

### Étape 1 — Créer le dépôt GitHub

1. Ouvre [https://github.com/new](https://github.com/new)
2. Nom du dépôt : `firmin-sanou` (ou ce que tu veux)
3. Visibilité : **Public** (recommandé) ou Private — les deux marchent
4. **Ne coche pas** « Add a README » — on en a déjà un
5. Clique « Create repository »

### Étape 2 — Pousser le code

Dans un terminal, depuis le dossier `C:\Users\amiro\projects\firmin-sanou\` :

```bash
git init
git add .
git commit -m "Initial commit — nouveau site Firmin Sanou"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/firmin-sanou.git
git push -u origin main
```

✅ **Tu dois voir** : tous les fichiers apparaître sur la page GitHub du dépôt.

### Étape 3 — Connecter Netlify à GitHub

1. Va sur [https://app.netlify.com/](https://app.netlify.com/)
2. Clique « **Add new site** » → « **Import an existing project** »
3. Choisis **GitHub** et autorise l'accès si demandé
4. Sélectionne le dépôt `firmin-sanou`
5. Laisse tous les paramètres par défaut (le `netlify.toml` est déjà configuré)
6. Clique « **Deploy site** »

✅ **Tu dois voir** : « Site is live » et un lien type `https://random-name-xyz.netlify.app/` qui montre le site.

### Étape 4 — Renommer le site (facultatif)

1. Dans Netlify, va dans **Site configuration → Change site name**
2. Mets `firmin-sanou` ou autre

✅ **Tu dois voir** : ton site à `https://firmin-sanou.netlify.app/`

### Étape 5 — Activer Netlify Identity (pour l'admin)

C'est l'étape qui permettra à Firmin de se connecter à `/admin` pour modifier le site.

1. Dans le dashboard Netlify de ton site, va dans **Integrations** → **Identity**
2. Clique « **Enable Identity** »
3. Une fois activé, va dans **Identity → Settings & usage** :
   - **Registration** : choisis « **Invite only** » (seul Firmin pourra entrer)
4. Toujours dans Identity, va dans **Services → Git Gateway** :
   - Clique « **Enable Git Gateway** »

✅ **Tu dois voir** : « Git Gateway is enabled » avec ton dépôt GitHub.

### Étape 6 — Inviter Firmin

1. Dans **Identity → Users**, clique « **Invite users** »
2. Mets l'email de Firmin (par exemple `firminleonard.arts@gmail.com`)
3. Clique « **Send »

Firmin reçoit alors un email avec un lien d'invitation. Quand il clique :
- Il choisit un mot de passe
- Il est redirigé vers `https://ton-site.netlify.app/admin/`
- Il peut commencer à éditer

---

## 🎨 Comment Firmin utilisera l'admin

Il ouvre `https://ton-site.netlify.app/admin/` et se connecte. Il voit ensuite 4 sections :

### 📷 « Œuvres »
Pour ajouter / modifier / supprimer une sculpture :
- Cliquer sur « Œuvres » → « Toutes les œuvres »
- Cliquer sur « Add Œuvres » pour en ajouter
- Remplir : Titre, Année, Taille, Catégorie, Photo (upload depuis son ordi), Description
- Cliquer « **Publish** » → la nouvelle œuvre apparaît sur le site en ~1 minute

### 🖼️ « Expositions »
Pareil pour ajouter une exposition : Titre, Lieu, Date, Affiche, Description.

### 🤝 « Partenaires »
Pour gérer les logos partenaires affichés sur la page Contact.

### ⚙️ « Paramètres du site »
Pour modifier : coordonnées téléphone/email, adresse, liens réseaux sociaux, et les textes de la page d'accueil (hero + bio).

> **Note importante** : Les modifications via l'admin s'appliquent automatiquement à la **page Œuvres** (galerie). Pour les autres pages (accueil, portrait, technique), si Firmin veut modifier les textes principaux, il faut passer par l'admin « Paramètres du site » qui agit sur certaines parties seulement. Pour des modifs de contenu plus profondes (réécrire toute la bio par exemple), tu peux soit éditer le HTML directement, soit me demander d'étendre les zones éditables.

---

## 🌍 Brancher le domaine firminsanou.com

Quand tu seras prêt à utiliser le vrai domaine :

1. Dans Netlify, **Domain management** → **Add a domain**
2. Tape `firminsanou.com`
3. Netlify te donnera des DNS à configurer chez le registrar actuel du domaine (probablement OVH, Gandi ou autre)
4. Suis les instructions — généralement c'est 2 enregistrements à mettre à jour
5. SSL/HTTPS sera activé automatiquement par Netlify une fois les DNS propagés (~1h en général)

---

## 💻 Tester le site en local

Le site est purement statique, mais à cause des `fetch('data/oeuvres.json')` (pour la galerie dynamique), il faut un mini serveur HTTP local — sinon le navigateur bloque la lecture des JSON.

**Option 1 (recommandée) — Python** :
```bash
cd C:\Users\amiro\projects\firmin-sanou
python -m http.server 8000
```
Puis ouvrir [http://localhost:8000](http://localhost:8000)

**Option 2 — Node** :
```bash
npx serve .
```

Sans serveur local, ouvrir `index.html` directement marche aussi (les pages affichent le contenu intégré en dur), mais la liste dynamique des œuvres ne s'actualisera pas.

---

## 🔧 Modifier le site sans l'admin (pour les changements de design)

Pour éditer le HTML/CSS/contenu en dur :
1. Modifie les fichiers dans ton éditeur
2. `git add .` → `git commit -m "ta modif"` → `git push`
3. Netlify détecte le push et redéploie automatiquement en ~30 secondes

---

## 📝 Notes techniques

- **Architecture** : Site statique pur, HTML + CSS + JS inlinés par page (zéro framework, ultra rapide).
- **CMS** : [Decap CMS](https://decapcms.org) (open source, anciennement Netlify CMS). Stocke tout dans Git, pas de base de données.
- **Authentification admin** : Netlify Identity (gratuit jusqu'à 1000 utilisateurs).
- **Photos** : Uploadées dans `images/uploads/` quand Firmin en ajoute via l'admin. Les photos d'origine sont dans `images/oeuvres/`, `images/expositions/`, etc.
- **Hébergement** : Netlify gratuit (100 GB de bande passante/mois, largement suffisant).

---

## ❓ Problèmes fréquents

**« L'admin affiche page blanche »**
→ Vérifie que Netlify Identity et Git Gateway sont bien activés (étape 5).

**« Firmin ne reçoit pas l'email d'invitation »**
→ Vérifie ses spams. Sinon dans Identity → Users, clique sur son nom → « Resend invitation ».

**« J'ai modifié quelque chose, ça ne se met pas à jour »**
→ Netlify met ~30 secondes à 1 minute pour redéployer. Vérifie dans Netlify → Deploys que le nouveau déploiement est passé en vert.

**« La galerie n'affiche pas les nouvelles œuvres ajoutées »**
→ Vide le cache du navigateur (Ctrl+Shift+R). Le fichier `oeuvres.json` est en cache 60 secondes max.

---

## 📜 Crédits

- Conception et code : assistant IA + Amir
- Œuvres et photos : Firmin Sanou
- Police d'affichage : [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond)
- Police de texte : [Inter](https://fonts.google.com/specimen/Inter)
