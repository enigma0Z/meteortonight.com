#!/bin/bash -x

DISTRIBUTION_ID="E3VPPPM441BDBB"
BUCKET="s3://pokemon-enigma0z-com"

S3="aws s3"
$S3 cp --cache-control no-cache out/index.html $BUCKET
$S3 cp --cache-control no-cache out/404.html $BUCKET
$S3 cp out/robots.txt $BUCKET
$S3 cp out/favicon.ico $BUCKET
$S3 sync --delete out/_next $BUCKET/_next
$S3 sync --delete out/content $BUCKET/content
$S3 sync --delete out/md $BUCKET/md
$S3 sync --delete out/img $BUCKET/img
$S3 sync --delete out/tools $BUCKET/tools
$S3 sync --delete out/data $BUCKET/data

CF="aws cloudfront"
$CF create-invalidation --distribution-id $DISTRIBUTION_ID --paths '/index.html' '/*'