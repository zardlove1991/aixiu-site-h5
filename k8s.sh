#!/bin/sh
#将.env中的配置替换到文件中，文件中变量设置方式为{{变量}}
function fileReplaceConf(){
  for line in `cat /m2odata/www/.env`
  do
    c=${line:0:1}
    if [ $c != '#' ]
    then
      k="{{"
      k="${k}${line%=*}}}"
      v=`echo "${line#*=}" | sed 's/\//\\\\\//g'`
      sed -i "s/${k}/${v}/g" $1
    fi
  done
}
fileReplaceConf /m2odata/www/setting.js

echo 'server
{
         listen       80;
         index index.html index.htm;
         root  /m2odata/www/;
         charset utf-8;
         server_tokens off;
         location /
         {
            try_files $uri $uri/ /index.html =404;
            add_header Cache-Control "private, no-store, no-cache, must-revalidate, proxy-revalidate";
         }
         location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
         {
            expires      1d;
         }
         location ~ .*\.(js|css)?$
         {
            expires      1d;
         }

         location ~ /\. {
            deny  all;
         }
}' > /etc/nginx/conf.d/default.conf
