FROM nginx:1.19.6-alpine

#CONF 替换配置文件
RUN rm -rf /etc/nginx/nginx.conf
COPY ./nginx.conf /etc/nginx/nginx.conf
# 静态资源替换
COPY ./dist /usr/share/nginx/html
# /var/log/nginx 
EXPOSE 80
