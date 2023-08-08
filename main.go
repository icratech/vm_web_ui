package main

import (
	"fmt"
	"log"
	// "mime"
	"net/http"

	"github.com/leehayford/go-sveltekit/pkg"
	"github.com/leehayford/go-sveltekit/pkg/des"
	"github.com/leehayford/go-sveltekit/pkg/c001v001"
	c001v001Demo "github.com/leehayford/go-sveltekit/pkg/c001v001/demo"
)

func main( ) {
	// mime.AddExtensionType(".js", "application/javascript")
	var err error

	fmt.Println("main( ) -> go-sveltekit starting...")

	fmt.Println("main( ) -> go-sveltekit initializing database...")
	if err := des.DB.CreateDESDatabase(pkg.DES_DB, false); err != nil {
		log.Fatal(err)
	}

	/* MQTT - C001V001 - SUBSCRIBE TO ALL REGISTERES DEVICES */
	fmt.Println("Connecting all C001V001 MQTT Device Clients...")
	c001v001.MQTTDeviceClient_CreateAndConnectAll()
	
	/* ROUTING STUFF */
	mux := http.NewServeMux()

	/* ROUTING - C001V001 - ADD ALL ROUTES TO THE MUX */
	fmt.Println("Registering all C001V001 HTTP routes...")
	c001v001.RegisterDeviceRoutes(mux)
	c001v001.RegisterJobRoutes(mux)
	c001v001Demo.RegisterDemoDeviceRoutes(mux)

	/* FRONTEND - POINT TO THE UI */
	mux.Handle("/", http.FileServer(http.Dir("./web/build")))

	fmt.Println("Starting server; listening on port 8003...")
	// http.ListenAndServeTLS("127.0.0.1:8003", "cert.pem", "key.pem", mux)
	err = http.ListenAndServe("127.0.0.1:8003", mux)
	if err != nil {
		log.Fatal("\nError starting server.\n", err)
	}

}