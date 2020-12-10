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
fileReplaceConf /m2odata/www/index.html
