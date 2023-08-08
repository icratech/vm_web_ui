package demo

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	phao "github.com/eclipse/paho.mqtt.golang"
	"github.com/leehayford/go-sveltekit/pkg"
	"github.com/leehayford/go-sveltekit/pkg/des"
	cv "github.com/leehayford/go-sveltekit/pkg/c001v001"
)

type DemoDeviceClient struct {
	cv.Device
	Sim
	sizeChan    chan int
	sentChan    chan int
	SSEClientID string
	http.Flusher
	CTX    context.Context
	Cancel context.CancelFunc
	des.DESMQTTClient
}

func (demo *DemoDeviceClient) SSEDemoDeviceClient_Connect(w http.ResponseWriter, r *http.Request) {

	ok := false
	demo.Flusher, ok = w.(http.Flusher)
	if !ok {
		fmt.Println("(demo *DemoDeviceClient) SSEDemoDeviceClient_Connect( ... ): Could not initialize http.Flusher.")
		return
	}

	fmt.Printf("\n(demo *DemoDeviceClient) SSEDemoDeviceClient_Connect(...) -> demo.DeviceSerial: %s\n\n", demo.DESDevSerial)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	demo.sizeChan = make(chan int)
	defer func() {
		close(demo.sizeChan)
		demo.sizeChan = nil
	}()
	demo.sentChan = make(chan int)
	defer func() {
		close(demo.sentChan)
		demo.sentChan = nil
	}()

	demo.CTX, demo.Cancel = context.WithCancel(context.TODO())
	defer demo.Cancel()

	demo.MQTTDemoDeviceClient_Connect()

	go demo.Demo_Run_Sim()

	for ok {
		select {

		case <-r.Context().Done():
			demo.MQTTDemoDeviceClient_Disconnect()
			demo.Cancel()
			ok = false
			return

		case size := <- demo.sizeChan:
			fmt.Fprintf(w, "data: %d\n\n", size)
			demo.Flusher.Flush()

		case sent := <- demo.sentChan:
			fmt.Fprintf(w, "data: %d\n\n", sent)
			demo.Flusher.Flush()

		}

	}
}

/*
	 NOT FOR PRODUCTION - SIMULATES A C001V001 DEVICE
		MQTT DEMO DEVICE CLIENT

PUBLISHES ALL SIG TOPICS AS A SINGLE DEVICE
SUBSCRIBES TO ALL COMMAND TOPICS AS A SINGLE DEVICE
*/
func (demo *DemoDeviceClient) MQTTDemoDeviceClient_Connect() (err error) {

	demo.MQTTUser = pkg.MQTT_USER
	demo.MQTTPW = pkg.MQTT_PW
	demo.MQTTClientID = fmt.Sprintf(
		"DMODevice-%s-%s-%s",
		demo.DESDevClass,
		demo.DESDevVersion,
		demo.DESDevSerial,
	)
	if err = demo.DESMQTTClient.DESMQTTClient_Connect(); err != nil {
		return err
	}
	pkg.Json(`(demo *DemoDeviceClient) MQTTDemoDeviceClient_Connect()(...) -> 
	demo.DESMQTTClientDESMQTTClient_Connect() -> demo.DESMQTTClient.ClientOptions.ClientID:`,
		demo.DESMQTTClient.ClientOptions.ClientID)

	demo.MQTTSubscription_DemoDeviceClient_CMDAdmin().Sub(demo.DESMQTTClient)
	demo.MQTTSubscription_DemoDeviceClient_CMDConfig().Sub(demo.DESMQTTClient)
	demo.MQTTSubscription_DemoDeviceClient_CMDEvent().Sub(demo.DESMQTTClient)

	return err
}
func (demo *DemoDeviceClient) MQTTDemoDeviceClient_Disconnect() {

	/* UNSUBSCRIBE FROM ALL MQTTSubscriptions */
	demo.MQTTSubscription_DemoDeviceClient_CMDAdmin().UnSub(demo.DESMQTTClient)
	demo.MQTTSubscription_DemoDeviceClient_CMDConfig().UnSub(demo.DESMQTTClient)
	demo.MQTTSubscription_DemoDeviceClient_CMDEvent().UnSub(demo.DESMQTTClient)

	/* DISCONNECT THE DESMQTTCLient */
	demo.DESMQTTClient_Disconnect()

	fmt.Printf("(demo *DemoDeviceClient) MQTTDemoDeviceClient_Disconnect( ... ): Complete; OKCancel.\n")
}

/*
SUBSCRIPTIONS
*/
/* SUBSCRIPTION -> ADMINISTRATION -> UPON RECEIPT, REPLY TO .../cmd/admin */
func (demo *DemoDeviceClient) MQTTSubscription_DemoDeviceClient_CMDAdmin() des.MQTTSubscription {
	return des.MQTTSubscription{

		Qos:   0,
		Topic: cv.MQTTTopic_CMDAdmin(demo.DESDevSerial),
		Handler: func(c phao.Client, msg phao.Message) {

			mqtt := &cv.MQTTAdmin{}
			if err := json.Unmarshal(msg.Payload(), mqtt); err != nil {
				pkg.Trace(err)
			}

			/* SIMULATE HAVING DONE SOMETHING */
			time.Sleep(time.Millisecond * 500)
			mqtt.AdmTime = time.Now().UTC().UnixMicro()

			demo.MQTTPublication_DemoDeviceClient_SIGAdmin(mqtt)
		},
	}
}

/* SUBSCRIPTIONS -> CONFIGURATION -> UPON RECEIPT, REPLY TO .../cmd/config */
func (demo *DemoDeviceClient) MQTTSubscription_DemoDeviceClient_CMDConfig() des.MQTTSubscription {
	return des.MQTTSubscription{

		Qos:   0,
		Topic: cv.MQTTTopic_CMDConfig(demo.DESDevSerial),
		Handler: func(c phao.Client, msg phao.Message) {

			mqtt := &cv.MQTTConfig{}
			if err := json.Unmarshal(msg.Payload(), mqtt); err != nil {
				pkg.Trace(err)
			}

			/* SIMULATE HAVING DONE SOMETHING */
			time.Sleep(time.Millisecond * 500)
			mqtt.CfgTime = time.Now().UTC().UnixMicro()

			demo.MQTTPublication_DemoDeviceClient_SIGConfig(mqtt)
		},
	}
}

/* SUBSCRIPTIONS -> CONFIGURATION -> UPON RECEIPT, REPLY TO .../cmd/config */
func (demo *DemoDeviceClient) MQTTSubscription_DemoDeviceClient_CMDEvent() des.MQTTSubscription {
	return des.MQTTSubscription{

		Qos:   0,
		Topic: cv.MQTTTopic_CMDEvent(demo.DESDevSerial),
		Handler: func(c phao.Client, msg phao.Message) {

			mqtt := &cv.MQTTEvent{}
			if err := json.Unmarshal(msg.Payload(), mqtt); err != nil {
				pkg.Trace(err)
			}

			/* SIMULATE HAVING DONE SOMETHING */
			time.Sleep(time.Millisecond * 500)
			mqtt.EvtTime = time.Now().UTC().UnixMicro()

			demo.MQTTPublication_DemoDeviceClient_SIGEvent(mqtt)
		},
	}
}

/*
PUBLICATIONS
*/
/* PUBLICATION -> CONFIG -> SIMULATED CONFIGS */
func (demo *DemoDeviceClient) MQTTPublication_DemoDeviceClient_SIGAdmin(Admin *cv.MQTTAdmin) bool {
	return (des.MQTTPublication{

		Topic:    cv.MQTTTopic_SIGAdmin(demo.DESDevSerial),
		Message:  Admin.MQTTMessage_CMDAdmin(),
		Retained: false,
		WaitMS:   0,
		Qos:      0,
	}).Pub(demo.DESMQTTClient)
}

/* PUBLICATION -> CONFIG -> SIMULATED CONFIGS */
func (demo *DemoDeviceClient) MQTTPublication_DemoDeviceClient_SIGConfig(config *cv.MQTTConfig) bool {
	return (des.MQTTPublication{

		Topic:    cv.MQTTTopic_SIGConfig(demo.DESDevSerial),
		Message:  config.MQTTMessage_CMDConfig(),
		Retained: false,
		WaitMS:   0,
		Qos:      0,
	}).Pub(demo.DESMQTTClient)
}

/* PUBLICATION -> EVENT -> SIMULATED EVENTS */
func (demo *DemoDeviceClient) MQTTPublication_DemoDeviceClient_SIGEvent(event *cv.MQTTEvent) bool {
	return (des.MQTTPublication{

		Topic:    cv.MQTTTopic_SIGEvent(demo.DESDevSerial),
		Message:  event.MQTTMessage_CMDEvent(),
		Retained: false,
		WaitMS:   0,
		Qos:      0,
	}).Pub(demo.DESMQTTClient)
}

/* PUBLICATION -> SAMPLE -> SIMULATED SAMPLES */
func (demo *DemoDeviceClient) MQTTPublication_DemoDeviceClient_SIGSample(mqtts *cv.MQTTSample) bool {

	b64, err := json.Marshal(mqtts)
	if err != nil {
		pkg.Trace(err)
	}

	return (des.MQTTPublication{

		Topic:    cv.MQTTTopic_SIGSample(demo.DESDevSerial),
		Message:  string(b64),
		Retained: false,
		WaitMS:   0,
		Qos:      0,
	}).Pub(demo.DESMQTTClient)
}
