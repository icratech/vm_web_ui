package c001v001

import (
	"context"
	"fmt"
	"time"

	"net/http"


	phao "github.com/eclipse/paho.mqtt.golang"
	"github.com/leehayford/go-sveltekit/pkg"
	"github.com/leehayford/go-sveltekit/pkg/des"
)

type DeviceUserClient struct {
	Device
	adminChan   chan string
	configChan  chan string
	eventChan   chan string
	sampleChan  chan string
	diagChan    chan string
	SSEClientID string
	http.Flusher
	CTX    context.Context
	Cancel context.CancelFunc
	des.DESMQTTClient
}

func (duc *DeviceUserClient) SSEDeviceUserClient_Connect(w http.ResponseWriter, r *http.Request) {

	ok := false
	duc.Flusher, ok = w.(http.Flusher)
	if !ok {
		fmt.Println("(duc *DeviceUserClient) SSEDeviceUserClient_Connect( ... ): Could not initialize http.Flusher.")
		return
	}

	fmt.Printf("\n(duc *DeviceUserClient) SSEDeviceUserClient_Connect(...) -> duc.DeviceSerial: %s\n\n", duc.DESDevSerial)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	duc.adminChan = make(chan string)
	defer func() {
		close(duc.adminChan)
		duc.adminChan = nil
	}()
	duc.configChan = make(chan string)
	defer func() {
		close(duc.configChan)
		duc.configChan = nil
	}()
	duc.eventChan = make(chan string)
	defer func() {
		close(duc.eventChan)
		duc.eventChan = nil
	}()
	duc.sampleChan = make(chan string)
	defer func() {
		close(duc.sampleChan)
		duc.sampleChan = nil
	}()
	duc.diagChan = make(chan string)
	defer func() {
		close(duc.diagChan)
		duc.diagChan = nil
	}()

	duc.CTX, duc.Cancel = context.WithCancel(context.TODO())
	defer duc.Cancel()

	duc.MQTTDeviceUserClient_Connect()

	for ok {
		select {

		case <-r.Context().Done():
			duc.MQTTDeviceUserClient_Disconnect()
			duc.Cancel()
			ok = false
			return

		case admin := <-duc.adminChan:
			fmt.Fprintf(w, "data: %s\n\n", admin)
			duc.Flusher.Flush()

		case config := <-duc.configChan:
			fmt.Fprintf(w, "data: %s\n\n", config)
			duc.Flusher.Flush()

		case event := <-duc.eventChan:
			fmt.Fprintf(w, "data: %s\n\n", event)
			duc.Flusher.Flush()

		case sample := <-duc.sampleChan:
			fmt.Fprintf(w, "data: %s\n\n", sample)
			duc.Flusher.Flush()

		case diag := <-duc.diagChan:
			fmt.Fprintf(w, "data: %s\n\n", diag)
			duc.Flusher.Flush()
		}
	}
}

/*
	MQTT DEVICE USER CLIENT

SUBSCRIBES TO ALL SIGNALS FOR A SINGLE DEVICE
  - SENDS LIVE DATA TO A SINGLE USER UI VIA SSE
*/
func (duc *DeviceUserClient) MQTTDeviceUserClient_Connect( /*user, pw string*/ ) (err error) {

	/* TODO: replace with user specific credentials */
	user := pkg.MQTT_USER
	pw := pkg.MQTT_PW

	duc.MQTTUser = user
	duc.MQTTPW = pw
	duc.MQTTClientID = fmt.Sprintf(
		"DeviceUser-%s-%s-%s",
		duc.DESDevClass,
		duc.DESDevVersion,
		duc.DESDevSerial,
	)
	if err = duc.DESMQTTClient.DESMQTTClient_Connect(); err != nil {
		return err
	}
	// pkg.Json(`(duc *DeviceUserClient) MQTTDeviceUserClient_Connect(...) -> duc.DESMQTTClient.DESMQTTClient_Connect()
	// duc.DESMQTTClient.ClientOptions.ClientID:`,
	// duc.DESMQTTClient.ClientOptions.ClientID)

	duc.MQTTSubscription_DeviceUserClient_SIGAdmin().Sub(duc.DESMQTTClient)

	duc.MQTTSubscription_DeviceUserClient_SIGConfig().Sub(duc.DESMQTTClient)

	duc.MQTTSubscription_DeviceUserClient_SIGEvent().Sub(duc.DESMQTTClient)

	duc.MQTTSubscription_DeviceUserClient_SIGSample().Sub(duc.DESMQTTClient)

	duc.MQTTSubscription_DeviceUserClient_SIGDiagSample().Sub(duc.DESMQTTClient)

	return err
}
func (duc *DeviceUserClient) MQTTDeviceUserClient_Disconnect() {

	/* UNSUBSCRIBE FROM ALL MQTTSubscriptions */
	duc.MQTTSubscription_DeviceUserClient_SIGAdmin().UnSub(duc.DESMQTTClient)

	duc.MQTTSubscription_DeviceUserClient_SIGConfig().UnSub(duc.DESMQTTClient)

	duc.MQTTSubscription_DeviceUserClient_SIGEvent().UnSub(duc.DESMQTTClient)

	duc.MQTTSubscription_DeviceUserClient_SIGSample().UnSub(duc.DESMQTTClient)

	duc.MQTTSubscription_DeviceUserClient_SIGDiagSample().UnSub(duc.DESMQTTClient)

	/* DISCONNECT THE DESMQTTCLient */
	duc.DESMQTTClient_Disconnect()

	/* ENSURE ALL SSE MESSAGES HAVE CLEARED BEFORE CLOSING CHANELS*/
	time.Sleep(time.Second * 5 ) 

	// close(duc.adminChan)
	// duc.adminChan = nil

	// close(duc.configChan)
	// duc.configChan = nil

	// close(duc.eventChan)
	// duc.eventChan = nil
	
	// close(duc.sampleChan)
	// duc.sampleChan = nil

	// close(duc.diagChan)
	// duc.diagChan = nil

	fmt.Printf("(duc *DeviceUserClient) MQTTDeviceUserClient_Disconnect( ... ): Complete; OKCancel.\n")
}


/*
SUBSCRIPTIONS
*/

/* SUBSCRIPTIONS -> ADMINISTRATION   */
func (duc *DeviceUserClient) MQTTSubscription_DeviceUserClient_SIGAdmin() des.MQTTSubscription {
	return des.MQTTSubscription{

		Qos:   0,
		Topic: MQTTTopic_SIGAdmin(duc.DESDevSerial),
		Handler: func(c phao.Client, msg phao.Message) {
			(&AdminJDB{}).SendSSEAdmin(&duc.Job, duc.adminChan, msg.Payload())
		},
	}
}

/* SUBSCRIPTION -> CONFIGURATION   */
func (duc *DeviceUserClient) MQTTSubscription_DeviceUserClient_SIGConfig() des.MQTTSubscription {
	return des.MQTTSubscription{

		Qos:   0,
		Topic: MQTTTopic_SIGConfig(duc.DESDevSerial),
		Handler: func(c phao.Client, msg phao.Message) {
			(&ConfigJDB{}).SendSSEConfig(&duc.Job, duc.configChan, msg.Payload())
		},
	}
}

/* SUBSCRIPTION -> EVENT   */
func (duc *DeviceUserClient) MQTTSubscription_DeviceUserClient_SIGEvent() des.MQTTSubscription {
	return des.MQTTSubscription{

		Qos:   0,
		Topic: MQTTTopic_SIGEvent(duc.DESDevSerial),
		Handler: func(c phao.Client, msg phao.Message) {
			(&EventJDB{}).SendSSEEvent(&duc.Job, duc.eventChan, msg.Payload())
		},
	}
}

/* SUBSCRIPTION -> SAMPLE   */
func (duc *DeviceUserClient) MQTTSubscription_DeviceUserClient_SIGSample() des.MQTTSubscription {
	return des.MQTTSubscription{

		Qos:   0,
		Topic: MQTTTopic_SIGSample(duc.DESDevSerial),
		Handler: func(c phao.Client, msg phao.Message) {
			/* WRANGLE AND SEND SSE DATA */
			(&Sample{}).SendSSESamples(duc.sampleChan, msg.Payload())
		},
	}
}

/* SUBSCRIPTION -> DIAG SAMPLE   */
func (duc *DeviceUserClient) MQTTSubscription_DeviceUserClient_SIGDiagSample() des.MQTTSubscription {
	return des.MQTTSubscription{

		Qos:   0,
		Topic: MQTTTopic_SIGDiagSample(duc.DESDevSerial),
		Handler: func(c phao.Client, msg phao.Message) {
			/* WRANGLE SSE DATA */
			/* SEND SSE DATA */
			duc.diagChan <- "diag_sample data..."
		},
	}
}


/*
PUBLICATIONS... none, I guess....
*/
