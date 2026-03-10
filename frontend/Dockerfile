# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app

# --- ADD THESE LINES HERE ---
ARG REACT_APP_RAZORPAY_KEY_ID
ENV REACT_APP_RAZORPAY_KEY_ID=$REACT_APP_RAZORPAY_KEY_ID
# ----------------------------

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
# Copy build files (Change 'dist' to 'build' if not using Vite)
COPY --from=build /app/dist /usr/share/nginx/html
# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5000
CMD ["nginx", "-g", "daemon off;"]