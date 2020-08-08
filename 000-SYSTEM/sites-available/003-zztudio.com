<VirtualHost *:80>
    DocumentRoot /var/www/zztudio/
    ServerName www.zztudio.com
    ServerAlias zztudio.com
</VirtualHost>

