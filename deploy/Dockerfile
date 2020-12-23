FROM craigmiller160-nginx-base:1.0.0

RUN apt-get update && apt-get install unzip

COPY build/auth-management-ui-*.zip /var/www/auth-management-ui.zip
RUN unzip /var/www/auth-management-ui.zip -d /var/www/
RUN rm /var/www/auth-management-ui.zip
RUN cp /var/www/nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx","-g","daemon off;"]
