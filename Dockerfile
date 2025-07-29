FROM golang:1.24.4-alpine AS builder

ENV CGO_ENABLED=0 \
    GOOS=linux \
    GOARCH=amd64

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY backend/ ./backend
COPY database/ ./database

RUN go build -o webnotes_backend ./backend

FROM gcr.io/distroless/static-debian12

WORKDIR /

COPY --from=builder /app/webnotes_backend .

EXPOSE 8080

ENTRYPOINT ["/webnotes_backend"]
