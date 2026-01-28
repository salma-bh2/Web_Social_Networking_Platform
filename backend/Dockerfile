# backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# 1) Installer les dépendances en profitant du cache Docker
COPY package*.json ./
RUN npm ci

# 2) Copier le code
COPY . .

# 3) Exposer le port de l'API
EXPOSE 4000

# 4) Démarrer (en dev Docker tu peux garder node; plus tard tu pourras ajuster)
CMD ["npm", "start"]
