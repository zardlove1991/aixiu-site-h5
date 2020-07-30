#!/bin/sh
npm run build

if [ `id -u` -eq 0 ]; then
echo "Execution by root not allowed"
exit 1
fi

ssh root@192.168.160.141  "rm -rf /srv/www/xz_dist_test/xz_h5/*"
scp -r ./dist/static/ root@192.168.160.141:/srv/www/xz_dist_test/xz_h5/static/
scp -r ./dist/index.html root@192.168.160.141:/srv/www/xz_dist_test/xz_h5/

if [ $? -ne 0 ]; then
    echo "上传失败"
else
    echo "上传成功"
fi
ssh root@192.168.160.141  "chmod -R 777 /srv/www/xz_dist_test/xz_h5/"