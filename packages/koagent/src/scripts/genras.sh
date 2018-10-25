#/bin/sh

openssl genrsa -out ca.key 1024 &&
openssl req -new -key ca.key -out ca.csr &&
openssl x509 -req -in ca.csr -signkey ca.key -out ca.crt &&
openssl genrsa -out client.key 1024 &&
openssl req -new -key client.key -out client.csr &&
openssl x509 -req -CA ca.crt -CAkey ca.key -CAcreateserial -in client.csr -out client.crt
