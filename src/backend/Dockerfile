# Build stage
FROM golang:1.24.3-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy and download dependencies
COPY go.mod go.sum ./
RUN go mod download

# Copy the entire source code
COPY . .

# Build the Go application (binary named 'server')
RUN go build -o server ./main.go

# Production stage
FROM alpine:3.19

# Set working directory
WORKDIR /app

# Install tzdata for timezone support
RUN apk add --no-cache tzdata

# Copy the compiled binary from the build stage
COPY --from=build /app/server ./server

# Expose port (assuming your app listens on port 4000)
EXPOSE 4000

# Run the binary
CMD ["./server"]