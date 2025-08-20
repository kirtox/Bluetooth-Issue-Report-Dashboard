FROM node:20 AS build
WORKDIR /app

# 先複製 package 檔案，避免 COPY node_modules
COPY package*.json ./

# 安裝依賴（會建立正確的 Linux node_modules）
RUN npm install

# 再複製其他程式碼
COPY . .

# 確保 tsc 有執行權限（安全保險）
RUN chmod +x node_modules/.bin/tsc

# 建置前端
RUN npm run build

# 最後用 lighter image 來 serve（選擇 nginx 或 node）
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
