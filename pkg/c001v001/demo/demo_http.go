package demo

import (
	// "context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"

	// "time"

	"github.com/leehayford/go-sveltekit/pkg"
	"github.com/leehayford/go-sveltekit/pkg/des"
	cv "github.com/leehayford/go-sveltekit/pkg/c001v001"
)

/* THIS SIMULATES A REAL DEVICE - NOT FOR PRODUCTION */
func RegisterDemoDeviceRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/001/001/demo_device/run_csv", HandleDemo_Run_Sim_CSV)
	mux.HandleFunc("/001/001/demo_device/run_sim", HandleDemo_Run_Sim)
	// mux.HandleFunc("/001/001/demo_device/sse_test", HandleDemo_SSE_Test)
}

/* THIS SIMULATES A REAL DEVICE - NOT FOR PRODUCTION */
type Sim struct {
	Qty     int   `json:"qty"`
	Dur     int64 `json:"dur"`
	FillQty int64 `json:"fill_qty"`
}

/* THIS SIMULATES A REAL DEVICE - NOT FOR PRODUCTION */
func HandleDemo_Run_Sim_CSV(w http.ResponseWriter, r *http.Request) {

	mr, err := r.MultipartReader()
	if err != nil {
		pkg.HTTPErr(&w, err)
		return
	}
	r.MultipartReader()

	desr := &des.DESRegistration{}
	sim := Sim{}
	var file *os.File
	for {
		part, err := mr.NextPart()
		if err == io.EOF { // Thats good; we're done.
			break
		}
		if err != nil { // That's bad...
			pkg.HTTPErr(&w, err)
			return
		}

		if part.FormName() == "sim" {
			dec := json.NewDecoder(part)
			err = dec.Decode(&sim)
			if err != nil { // That's bad...
				pkg.HTTPErr(&w, err)
				return
			} // pkg.Json("HandleDemo_Device_RunCSV(...) -> sim", sim)
		}

		if part.FormName() == "desr" {
			dec := json.NewDecoder(part)
			err = dec.Decode(&desr)
			if err != nil { // That's bad...
				pkg.HTTPErr(&w, err)
				return
			} // pkg.Json("HandleDemo_Device_RunCSV(...) -> sim", sim)
		}

		if part.FormName() == "file" {
			path := "./dev_data/" + part.FileName()

			/* This is a ...*/
			file, err = os.Create(path)
			if err != nil { // That's bad...
				pkg.HTTPErr(&w, err)
				return
			}

			/* .... really long way ...*/
			_, err = io.Copy(file, part)
			if err != nil {
				pkg.HTTPErr(&w, err)
				return
			} // fmt.Printf("\n Received file:%s,\tLength:%d\n", file.Name(), i)

			defer part.Close()
		}

		demo := &DemoDeviceClient{}
		demo.RegisterDemoDevice(desr)
		demo.Demo_Run_Sim_CSV(file, sim)
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode("CSV Simulation running...")

}

/* THIS SIMULATES A REAL DEVICE - NOT FOR PRODUCTION */
func HandleDemo_Run_Sim(w http.ResponseWriter, r *http.Request) {

	simStr, _ := url.QueryUnescape(r.URL.Query().Get("sim"))
	des_regStr, _ := url.QueryUnescape(r.URL.Query().Get("des_reg"))

	des_reg := &des.DESRegistration{}
	if err := json.Unmarshal([]byte(des_regStr), &des_reg); err != nil {
		pkg.Trace(err)
		/*TODO: PROPER HTTP STATUS ETC */
		// w.Write([]byte("CONNECTION FAILED - BAD DESR DATA IN REQUEST"))
	}
	des_reg.DESDevRegAddr = r.RemoteAddr
	des_reg.DESJobRegAddr = r.RemoteAddr

	sim := Sim{}
	if err := json.Unmarshal([]byte(simStr), &sim); err != nil {
		pkg.Trace(err)
		/*TODO: PROPER HTTP STATUS ETC */
		// w.Write([]byte("CONNECTION FAILED - BAD SIM DATA IN REQUEST"))
	}

	ssecid := fmt.Sprintf("%s-DEMO-%d-%s",
		r.RemoteAddr,
		des_reg.DESDevRegUesrID,
		des_reg.DESJobName,
	)
	
	demo := &DemoDeviceClient{
		Device:      cv.Device{
			DESDevice: des_reg.DESDevice,
			Job:         cv.Job{
				DESJob: des_reg.DESJob,
			},
		},
		Sim:         sim,
		SSEClientID: ssecid,
	} // fmt.Printf("\nHandleDemo_Run_Sim(...) -> ddc: %v\n\n", ddc)
	demo.SSEDemoDeviceClient_Connect(w, r)

	/* if r.Method == "POST" {

		mr, err := r.MultipartReader()
		if err != nil {
			pkg.HTTPErr(&w, err)
			return
		}
		r.MultipartReader()


		for {
			part, err := mr.NextPart()
			if err == io.EOF { // Thats good; we're done.
				break
			}
			if err != nil { // That's bad...
				pkg.HTTPErr(&w, err)
				return
			}

			if part.FormName() == "sim" {
				dec := json.NewDecoder(part)
				err = dec.Decode(&sim)
				if err != nil { // That's bad...
					pkg.HTTPErr(&w, err)
					return
				}
				pkg.Json("HandleDemo_Run_Sim(...) -> sim", sim)
			}

			if part.FormName() == "desr" {
				dec := json.NewDecoder(part)
				err = dec.Decode(&desr)
				if err != nil { // That's bad...
					pkg.HTTPErr(&w, err)
					return
				}
				pkg.Json("HandleDemo_Run_Sim(...) -> desr", desr)
			}
			defer part.Close()
		}

		demo := &DemoDevice{}
		demo.RegisterDemoDevice(desr)
		demo.Demo_Run_Sim(sim)

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode("Simulation running...")
	} */
}

// type SSETestClient struct {
// 	id     string
// 	active bool
// 	run    chan bool
// 	test   chan int64
// 	ctx    context.Context
// 	cancel context.CancelFunc
// }

// func HandleDemo_SSE_Test(w http.ResponseWriter, r *http.Request) {

// 	sse := SSETestClient{
// 		id:     fmt.Sprintf("SSE_Test_%d", time.Now().UTC().UnixMicro()),
// 		active: true,
// 		run:    make(chan bool),
// 		test:   make(chan int64),
// 	}
// 	sse.ctx, sse.cancel = context.WithCancel(context.Background())

// 	fmt.Printf("Starting MQTT Sim for:\t %s:\n", sse.id) // TODO: LOG
// 	w.Header().Set("Access-Control-Allow-Origin", "*")
// 	w.Header().Set("Content-Type", "text/event-stream")
// 	w.Header().Set("Cache-Control", "no-cache")
// 	w.Header().Set("Connection", "keep-alive")

// 	flusher, ok := w.(http.Flusher)
// 	if !ok {
// 		fmt.Println("Could not init http.Flusher.")
// 	} else {
// 		live := 10
// 		for live > 0 {

// 			sse.test <- time.Now().UTC().UnixMicro()
// 			flusher.Flush()

// 			time.Sleep(time.Millisecond * 500)
// 			live++
// 		}
// 	}
// }

// func HandleDemo_LocalCSV_MQTT_SSE(w http.ResponseWriter, r *http.Request) {

// 	/*TODO: Handle these values as request JSON...*/
// 	stamp, _ := url.QueryUnescape(r.URL.Query().Get("time"))
// 	serial, _ := url.QueryUnescape(r.URL.Query().Get("serial"))
// 	// fillQty := int64(7)
// 	// readQty := int(-1)
// 	// rate := time.Duration(500 * time.Millisecond)

// 	/*TODO:  HANDLE JOBID, PERMISSIONS ETC. */
// 	accessOK := true
// 	if accessOK {

// 		job, _ := NewJob(fmt.Sprintf("%s-%s", serial, stamp))
// 		fmt.Printf("\nHandleDemo_LocalCSV_MQTT_SSE():\nJob Name: %s\n\n", job.Name)

// 		// c_mqtt, err_mqtt := NewMQTTClient(pkg.NewMQTTClientData(job.Name))
// 		// if err_mqtt != nil {
// 		// 	pkg.Trace(err_mqtt)
// 		// }
// 		// topic := Sig(job.Name, "sample")

// 		/* SSE Stuff */
// 		sse := SSEClient{
// 			id:     fmt.Sprintf("%d", time.Now().UTC().UnixMicro()),
// 			active: true,
// 			pub:    make(chan string),
// 			sub:    make(chan string),
// 			run:    make(chan bool),
// 			one:    make(chan int),
// 		}
// 		sse.ctx, sse.cancel = context.WithCancel(context.Background())
// 		sseClientList = append(sseClientList, &sse)
// 		fmt.Printf("\nSSE clients active: %d.\n\n", len(sseClientList))

// 		fmt.Printf("Starting MQTT Sim for:\t %s:\n", sse.id) // TODO: LOG
// 		w.Header().Set("Access-Control-Allow-Origin", "*")
// 		w.Header().Set("Content-Type", "text/event-stream")
// 		w.Header().Set("Cache-Control", "no-cache")
// 		w.Header().Set("Connection", "keep-alive")

// 		// flusher, ok := w.(http.Flusher)
// 		// if !ok {
// 		// 	fmt.Println("Could not init http.Flusher.")
// 		// } else {

// 			// Sub(c_mqtt, topic, 1, func(c phao.Client, msg phao.Message) {

// 			// 	// Decode MQTT Sample Message (may contain several samples )
// 			// 	tss := DecodeMQTTSampleMessage(msg.Payload())

// 			// 	for _, ts := range tss {

// 			// 		// Write sample to jobDB.sample
// 			// 		ts.Write(job)

// 			// 		// Encode sample for SSE clients
// 			// 		js, js_err := json.Marshal(ts.EncodeSSESample())
// 			// 		if js_err != nil {
// 			// 			pkg.Trace(js_err)
// 			// 		}

// 			// 		// Send sample to SSE clients
// 			// 		for _, c := range sseClientList {
// 			// 			if c.active {
// 			// 				c.sub <- string(js)
// 			// 			}
// 			// 		}
// 			// 	}
// 			// })

// 		// 	go Demo_LocalCSV_MQTT_SSE(&sse, readQty, fillQty, job)
// 		// }

// 		// live := 1
// 		// for live > 0 {

// 		// 	select {

// 		// 	case sample_to_publish := <-sse.pub:
// 		// 		Pub(c_mqtt, topic, sample_to_publish)

// 		// 	case sample_received := <-sse.sub:
// 		// 		fmt.Fprintf(w, "data: %s\n\n", sample_received)
// 		// 		flusher.Flush()

// 		// 	case <-r.Context().Done():
// 		// 		sse.active = false
// 		// 		StopSSEClient(sse.id, c_mqtt, topic, &live)

// 		// 	default:
// 		// 		if sse.active {
// 		// 			sse.one <- 1
// 		// 		}
// 		// 		time.Sleep(rate)
// 		// 	}
// 		// }
// 	}
// }
