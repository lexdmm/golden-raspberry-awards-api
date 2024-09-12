# Usando imagem do Node.js
FROM node:21-alpine

# Defina o diretório de trabalho
WORKDIR /awards

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências
RUN yarn install yarn

# Instale as dependências
RUN yarn install

# Copie o código da aplicação
COPY . .

# Exponha a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["yarn", "run", "start"]