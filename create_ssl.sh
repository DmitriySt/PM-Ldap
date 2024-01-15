#!/bin/bash
HOST=$([ -n "$1" ] && echo $1 || echo "localhost")

openssl req -x509 -out $HOST.crt -keyout $HOST.key \
  -newkey rsa:2048 -nodes -sha256 -days 3650\
  -subj "/CN=$HOST" -extensions EXT -config <( \
   printf "[dn]\nCN=$HOST\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:$HOST\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
