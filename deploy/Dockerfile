FROM craigmiller160.ddns.net:30004/nginx-base:1.1.0

COPY build/auth-management-ui-*.tgz /var/www/auth-management-ui.tgz
RUN tar xvf /var/www/auth-management-ui.tgz -C /var/www/
RUN rm /var/www/auth-management-ui.tgz
RUN cp /var/www/nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx","-g","daemon off;"]
