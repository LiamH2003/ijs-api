# ijs-api

Node.js/Express API voor de Ben & Jerry's ijs-customizer. Verwerkt bestellingen die via de 3D-configurator geplaatst worden en stelt admin-endpoints beschikbaar om die bestellingen te beheren.

- **Live API:** https://ijs-api.onrender.com
- **Frontend repo:** https://github.com/LiamH2003/ijs-frontend

## Endpoints

| Methode | Route | Auth | Omschrijving |
|---|---|---|---|
| POST | `/admin/login` | — | Admin inloggen, geeft een JWT terug |
| POST | `/orders` | publiek | Nieuwe bestelling plaatsen |
| GET | `/orders` | admin (JWT) | Alle bestellingen ophalen |
| GET | `/orders/:id` | admin (JWT) | Eén bestelling ophalen |
| PATCH | `/orders/:id/status` | admin (JWT) | Status wijzigen (`te verwerken`, `verzonden`, `geannuleerd`) |
| DELETE | `/orders/:id` | admin (JWT) | Bestelling verwijderen |

Admin-routes verwachten een header `Authorization: Bearer <token>`, verkregen via `/admin/login`.

## Order-model

```js
{
  klantnaam: String,       // verplicht
  adres: String,           // verplicht
  ijsConfiguratie: {
    smaak: String,         // verplicht
    kleur: String,         // verplicht
    aantalBollen: Number   // verplicht, 1-3
  },
  totaalprijs: Number,     // verplicht
  status: String,          // 'te verwerken' | 'verzonden' | 'geannuleerd', default 'te verwerken'
  createdAt, updatedAt     // automatisch via mongoose timestamps
}
```

## Projectstructuur

```
├── server.js                      # Express-app, middleware, routes koppelen, DB-connectie
├── models/Order.js                # Mongoose-schema voor bestellingen
├── controllers/
│   ├── orderController.js         # CRUD-logica voor bestellingen
│   └── authController.js          # Login-logica (credentials checken, JWT signen)
├── routes/
│   ├── orders.js                  # /orders routes, beveiligd met requireAuth waar nodig
│   └── auth.js                    # /admin/login route
└── middleware/auth.js             # Verifieert JWT uit de Authorization-header
```

## Lokaal draaien

```sh
npm install
cp .env.example .env   # vul MONGO_URI, ADMIN_USERNAME, ADMIN_PASSWORD en JWT_SECRET in
npm run dev
```

De server draait standaard op `http://localhost:3000`.

## Environment variables

| Variabele | Omschrijving |
|---|---|
| `MONGO_URI` | Connectiestring naar je MongoDB Atlas cluster |
| `PORT` | Poort voor lokale ontwikkeling (Render zet deze zelf) |
| `ADMIN_USERNAME` | Gebruikersnaam voor het admin-dashboard |
| `ADMIN_PASSWORD` | Wachtwoord voor het admin-dashboard |
| `JWT_SECRET` | Geheime sleutel om login-tokens mee te ondertekenen |

## Deployment (Render)

1. Nieuwe **Web Service** aanmaken op [render.com](https://render.com), gekoppeld aan deze GitHub-repo (of de meegeleverde `render.yaml` gebruiken via "New > Blueprint").
2. Build command: `npm install` — Start command: `npm start`.
3. De vier environment variables hierboven instellen in het Render-dashboard.
4. Na deploy: de live URL toevoegen aan `VITE_API_URL` in de frontend-deployment.
