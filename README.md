# PLATFORM_V4

PLATFORM_V4/
├── backend/
│   ├── src/
│   │   ├── config/                      # config DB, env, sécurité
│   │   │   ├── env.js                   # charge/valide process.env
│   │   │   ├── db.js                    # connexion mongoose
│   │   │   └── logger.js
│   │   │
│   │   ├── models/                      # schémas Mongoose
│   │   │   ├── User.model.js
│   │   │   ├── Follow.model.js
│   │   │   ├── Thread.model.js
│   │   │   ├── Reply.model.js
│   │   │   ├── Reaction.model.js
│   │   │   └── Notification.model.js
│   │   │
│   │   ├── repositories/                # (ajout) accès DB centralisé (optionnel mais propre)
│   │   │   ├── user.repo.js
│   │   │   ├── follow.repo.js
│   │   │   ├── thread.repo.js
│   │   │   └── notification.repo.js
│   │   │
│   │   ├── controllers/                 # logique HTTP (req/res)
│   │   │   ├── auth/
│   │   │   │   └── auth.controller.js
│   │   │   ├── users/
│   │   │   │   └── users.controller.js
│   │   │   ├── follows/
│   │   │   │   └── follows.controller.js
│   │   │   ├── threads/
│   │   │   │   └── threads.controller.js
│   │   │   └── notifications/
│   │   │       └── notifications.controller.js
│   │   │
│   │   ├── services/                    # logique métier
│   │   │   ├── auth/
│   │   │   │   └── auth.service.js
│   │   │   ├── users/
│   │   │   │   └── users.service.js
│   │   │   ├── follows/
│   │   │   │   └── follows.service.js
│   │   │   ├── threads/
│   │   │   │   └── threads.service.js
│   │   │   └── notifications/
│   │   │       └── notifications.service.js
│   │   │
│   │   ├── routes/                      # endpoints (Express Router)
│   │   │   ├── auth.routes.js
│   │   │   ├── users.routes.js
│   │   │   ├── follows.routes.js
│   │   │   ├── threads.routes.js
│   │   │   ├── notifications.routes.js
│   │   │   └── index.js                 # (ajout) monte toutes les routes
│   │   │
│   │   ├── middlewares/                 # (rename) auth, validation, errors
│   │   │   ├── auth.middleware.js
│   │   │   ├── validate.middleware.js
│   │   │   ├── rateLimit.middleware.js
│   │   │   └── error.middleware.js      # IMPORTANT: (err, req, res, next)
│   │   │
│   │   ├── validators/                  # schémas Joi/Zod par domaine
│   │   │   ├── auth.validators.js
│   │   │   ├── users.validators.js
│   │   │   ├── follows.validators.js
│   │   │   ├── threads.validators.js
│   │   │   └── notifications.validators.js
│   │   │
│   │   ├── utils/                       # helpers
│   │   │   ├── jwt.js
│   │   │   ├── pagination.js
│   │   │   └── asyncHandler.js
│   │   │
│   │   ├── constants/                   # rôles, types, status
│   │   │   ├── roles.js
│   │   │   └── enums.js                 # FollowStatus, Visibility, NotificationType...
│   │   │
│   │   ├── docs/                        # Swagger/OpenAPI
│   │   │   └── openapi.yaml
│   │   │
│   │   ├── uploads/                     # OK si tu veux local (mais voir note ci-dessous)
│   │   │   └── .gitkeep
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── tests/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── nodemon.json
│   ├── package.json
│   ├── Dockerfile
│   └── README.md
├── docker-compose.yml
└── README.md
