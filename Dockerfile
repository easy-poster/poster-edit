FROM nginx
COPY ./dist /usr/share/nginx/html/
COPY ./nginx.conf /etc/nginx/conf.d/eposter.conf
EXPOSE 80