package main

import (
	"database/sql"
	"log"
	"login-system/internal/middleware"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"login-system/graph"
	"login-system/graph/generated"
	"login-system/internal/service"
)

const defaultPort = "4000"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	db, err := sql.Open("postgres", "your-postgres-connection-string")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

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

	// CORS setup
	corsHandler := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowCredentials: true,
		AllowedMethods:   []string{"POST", "GET", "OPTIONS"},
		AllowedHeaders:   []string{"Authorization", "Content-Type"},
	}).Handler

	http.Handle("/", playground.Handler("GraphQL playground", "/graphql"))
	// Wrap the GraphQL handler with auth middleware, then with CORS handler
	http.Handle("/graphql", corsHandler(middleware.JWTAuthMiddleware(srv)))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
