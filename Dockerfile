# Build stage
FROM golang:1.24.3-alpine AS build
WORKDIR /app
COPY src/backend/go.mod ./
RUN go mod download
COPY src/backend .
RUN go build -o server .

# Production stage
FROM alpine:3.19
WORKDIR /app
RUN apk add --no-cache tzdata
COPY --from=build /app/server /app/
CMD ["./server"]