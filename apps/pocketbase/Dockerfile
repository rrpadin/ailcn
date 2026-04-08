FROM alpine:3.19

WORKDIR /app

COPY pocketbase ./pocketbase
COPY pb_migrations ./pb_migrations
COPY pb_hooks ./pb_hooks

RUN chmod +x ./pocketbase

EXPOSE 8090

CMD ["sh", "-c", "./pocketbase serve --http=0.0.0.0:${PORT:-8090} --encryptionEnv=PB_ENCRYPTION_KEY --dir=/data --migrationsDir=./pb_migrations --hooksDir=./pb_hooks --hooksWatch=false"]
