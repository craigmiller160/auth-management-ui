FROM nexus-docker-craigmiller160.ddns.net/nginx-base:1.1.3

COPY build/auth-management-ui-*.tgz /var/www/auth-management-ui.tgz
RUN tar xvf /var/www/auth-management-ui.tgz -C /var/www/
RUN cp -R /var/www/package/build/* /var/www/
RUN rm -rf /var/www/package
RUN rm /var/www/auth-management-ui.tgz
RUN cp /var/www/nginx.conf /etc/nginx/nginx.conf

ENTRYPOINT ["nginx","-g","daemon off;"]
