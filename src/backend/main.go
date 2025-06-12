package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"login-system/graph"
	"login-system/graph/generated"
	"login-system/internal/middleware"
	"login-system/internal/service"
)

const defaultPort = "4000"

func main() {
	_ = godotenv.Load()

	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	env := os.Getenv("ENV")
	var dbURL string
	switch env {
	case "prod":
		dbURL = os.Getenv("DATABASE_PUBLIC_URL")
		if dbURL == "" {
			dbURL = os.Getenv("DATABASE_URL")
		}
	default:
		dbURL = os.Getenv("DATABASE_DEV_URL")
		if dbURL == "" {
			dbURL = os.Getenv("DATABASE_URL")
		}
	}

	if dbURL == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
	}
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := db.Close(); err != nil {
			log.Printf("Error closing database connection: %v", err)
		} else {
			log.Println("Database connection closed successfully")
		}
	}()

	// (Optional) You can add DB health check here
	if err := db.Ping(); err != nil {
		log.Fatal("Cannot connect to DB: ", err)
	}

	passkeyService := service.NewPasskeyService()

	srv := handler.NewDefaultServer(
		generated.NewExecutableSchema(
			generated.Config{
				Resolvers: &graph.Resolver{
					DB:             db,
					PasskeyService: passkeyService,
				},
			},
		),
	)

	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{
			"http://localhost:5173",
			"https://project-2-login-system.netlify.app",
		},
		AllowCredentials: true,
		AllowedMethods:   []string{"POST", "GET", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
	}).Handler

	// Health endpoint for ops/monitoring
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// Playground
	http.Handle("/", playground.Handler("GraphQL playground", "/graphql"))

	// GraphQL API with JWT auth and CORS
	http.Handle("/graphql", corsHandler(middleware.JWTAuthMiddleware(srv)))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
