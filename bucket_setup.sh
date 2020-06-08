#!/bin/bash

# Usage:
#
# either install aws cli for your OS or using python and virtual envs:
#
# PS> set PIPENV_DONT_LOAD_ENV=0; pipenv shell
# $ PIPENV_DONT_LOAD_ENV=0 pipenv install -r requierements.txt
# this will install the awscli-local localstack AWS CLI (https://github.com/localstack/awscli-local)
# in production you would want to use IAM and amazon's awslci
#
# $ pipenv shell
# then type the following command

# TODO: this configuration could be run int the onrun from the docker-compose.yml

if [ -z ${S3URL} ]
then
    S3URL=$([ ! -z $NO_PROXY ] && echo "$NO_PROXY" || echo localhost) # http://192.168.99.100
    S3URL=$(echo http://${S3URL}:4572/)
fi

echo "S3URL is set to: ${S3URL}"

BUCKETNAME=localstacktestbucket

# create a new bucket
awslocal --endpoint-url=${S3URL} s3 mb s3://${BUCKETNAME}

# set the bucket to be readable (UNSAFE, testing only)
awslocal --endpoint-url=${S3URL} s3api put-bucket-acl --bucket ${BUCKETNAME} --acl public-read

# copy a new file to the new bucket
awslocal --endpoint-url=${S3URL} s3 cp testfile.txt s3://${BUCKETNAME}/testfile.txt

# list bucket content
awslocal --endpoint-url=${S3URL} s3 ls s3://${BUCKETNAME}

#list buckets
awslocal --endpoint-url=${S3URL} s3 ls

# view buckets and more with browser
curl -v ${S3URL}${BUCKETNAME}

# even download files on the S3 server
wget -O ${S3URL}${BUCKETNAME}/testfile.txt test.txt
# PS> wget ${S3URL}${BUCKETNAME}/testfile.txt -Outfile test.txt