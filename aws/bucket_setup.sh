#!/bin/bash
# Usage:
#
# sh automatically launched on S3 startup
# TODO: this configuration could be run int the onrun from the docker-compose.yml
BUCKETNAME=localstacktestbucket
# create a new bucket
awslocal s3 mb s3://${BUCKETNAME}
# set the bucket to be readable (UNSAFE, testing only)
awslocal s3api put-bucket-acl --bucket ${BUCKETNAME} --acl public-read