# Visit Siliana — AI-Powered Ecotourism & Multi-Agent Platform

> **Projet de Fin d'Année (PFA) — Ingénierie Logicielle & Systèmes d'Information**  
> **Auteur :** Azer Khemiri  
> **Gouvernorat de Siliana, Tunisie**

---

## 📌 Présentation du Projet

**Visit Siliana** est une plateforme éco-touristique et patrimoniale de nouvelle génération dédiée à la valorisation du gouvernorat de Siliana en Tunisie (Djebel Bargou, village berbère perché de Kesra, cité antique de Mactaris / Makthar, et plaine historique de Zama).

Le projet intègre une architecture microservices moderne combinant **React 19**, **Node.js/Express**, **PostgreSQL**, et un service d'**Intelligence Artificielle Multi-Agents sous LangGraph** propulsé par le modèle **Google Gemini** et la météo en direct **Open-Meteo**.

---

## 🏛️ Architecture Globale du Système

```mermaid
graph TD
    subgraph Frontend (React 19 + Tailwind v4 + Vite)
        VisitorUI[Portail Public & Concierge IA Flottant]
        AdminUI[Espace Professionnel & Console Multi-Agents BI]
    end

    subgraph Backend Core (Express.js + Node.js)
        API[API REST : Auth, Bookings, Activities, Stays, Events]
        JWT[Sécurité JWT & Middleware de Validation]
    end

    subgraph Base de Données
        DB[(PostgreSQL : visit_siliana)]
    end

    subgraph Service IA Multi-Agents (Python FastAPI + LangGraph)
        Concierge[Concierge Voyageur : LangGraph + RAG ChromaDB]
        WeatherAPI[Outil Météo : Open-Meteo API en Direct]
        
        subgraph Multi-Agent BI Admin
            SQLAgent[Agent Spécialiste SQL]
            Guardrail[Guardrail Sécurité AST : Lecture Seule]
            AnalystAgent[Agent Analyste de Données]
            StrategyAgent[Agent Stratège Commercial]
            VizAgent[Agent Visualisation Graphique]
        end
    end

    VisitorUI --> API
    AdminUI --> API
    VisitorUI --> Concierge
    AdminUI --> SQLAgent
    Concierge --> WeatherAPI
    SQLAgent --> Guardrail --> DB
    API --> DB
```

---

## 🌟 Fonctionnalités Clés

### 1. Côté Voyageur & Grand Public
* **Identité Visuelle & Design de Luxe** : Palette sur-mesure (Vert Forêt `#2F5233`, Or Antique `#C9A86A`, Crème Chaud `#FAF8F3`), typographie serif d'époque (*Fraunces*) et micro-interactions modernes.
* **Internationalisation Complète (i18n)** : Support bilingue et trilingue (Français, Anglais, Arabe) avec bascule automatique du sens de lecture (`dir="rtl"` pour l'arabe).
* **Concierge IA & Météo en Direct (LangGraph)** :
  * Interroge en temps réel l'API **Open-Meteo** pour Siliana, Kesra et Djebel Bargou.
  * Évalue la sécurité des activités de montagne (alerte pluie/vent pour la spéléologie et l'escalade).
  * RAG avancé (ChromaDB) pour citer l'histoire antique et le terroir sans hallucination.
  * Recommandations avec liens directs de réservation en 1 clic.
* **Réservations & Reçus Instantanés** : Calcul automatique des tarifs de groupe, récapitulatifs instantanés et persistance PostgreSQL.

### 2. Côté Administration & Espace Professionnel
* **Équipe Multi-Agents Décisionnelle (LangGraph)** :
  * **Text-to-SQL Auto-Correctif** : Posez des questions en langage naturel (*« Donne-moi les réservations de la semaine dernière »*), l'agent génère et exécute la requête SQL.
  * **Boucle Cyclique de Self-Healing** : Si PostgreSQL retourne une erreur de syntaxe ou de colonne, le graphe LangGraph attrape l'erreur et la corrige automatiquement en cycle.
  * **Guardrail de Sécurité AST (`sqlparse`)** : Rejette rigoureusement toute tentative de modification destructive (`DROP`, `DELETE`, `UPDATE`, `INSERT`).
  * **Recommandations Stratégiques Proactives** : L'agent stratège calcule des opportunités de tarification dynamique, de remplissage en semaine et de cross-selling.
  * **Visualisations Automatisées** : Génération de spécifications graphiques JSON pour afficher des diagrammes dynamiques.
* **Gestion Complète (CRUD)** : Activités, Hébergements, Événements culturels et cycle de vie des réservations (en attente, confirmée, annulée, purge 24h).

---

## 🚀 Démarrage Rapide

### Prérequis
* Node.js v18+ & npm
* Python 3.11+
* PostgreSQL 15+

---

### Option 1 : Lancement Local des Services

#### 1. Base de Données PostgreSQL
Assurez-vous qu'une base `visit_siliana` existe sur PostgreSQL avec les identifiants configurés dans vos fichiers `.env`.

#### 2. Démarrer le Backend Express (Port 5000)
```bash
cd backend
npm install
npm run dev
```

#### 3. Démarrer le Service IA LangGraph (Port 8000)
```bash
cd ai-service
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### 4. Démarrer le Frontend React (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
Accédez à l'application sur : **`http://localhost:5173`**

---

### Option 2 : Déploiement Conteneurisé avec Docker Compose

Pour lancer l'ensemble de l'architecture distribuée en une seule commande :

```bash
docker compose up --build
```

---

## 🛡️ Sécurité & Bonnes Pratiques
* **Mots de passe hachés** avec `bcrypt` (facteur de coût 10).
* **Sessions sécurisées** avec JSON Web Tokens (`jsonwebtoken`) expirables.
* **Requêtes paramétrées** dans tous les modèles PostgreSQL (`$1, $2, ...`) contre les injections SQL.
* **Sessions PostgreSQL `READ ONLY`** et analyse syntaxique AST pour le service d'agent IA.

---

## 📜 Licence
Projet académique développé par Azer Khemiri — Visite & Préservation de Siliana, République Tunisienne © 2026.
