package c001v001

import (
	// "encoding/json"
	"fmt"

	phao "github.com/eclipse/paho.mqtt.golang"
	"github.com/leehayford/go-sveltekit/pkg"
	"github.com/leehayford/go-sveltekit/pkg/des"
)

/*
	MQTT DEVICE CLIENT

PUBLISHES ALL COMMANDS TO A SINGLE DEVICE
SUBSCRIBES TO ALL SIGNALS FOR A SINGLE DEVICE
  - WRITES MESSAGES TO THE JOB DATABASE
*/
func (device *Device) MQTTDeviceClient_Connect() (err error) {

	/* TODO: replace with <device.Class>-<device.Version> specific credentials */
	class_version_user := pkg.MQTT_USER
	class_version_pw := pkg.MQTT_PW

	device.MQTTUser = class_version_user
	device.MQTTPW = class_version_pw
	device.MQTTClientID = fmt.Sprintf(
		"DESDevice-%s-%s-%s",
		device.DESDevClass,
		device.DESDevVersion,
		device.DESDevSerial,
	)
	if err = device.DESMQTTClient.DESMQTTClient_Connect(); err != nil {
		return err
	}
	// pkg.Json(`(device *Device) RegisterMQTTDESDeviceClient(...) -> device.DESMQTTClient.RegisterDESMQTTClient()
	// device.DESMQTTClient.ClientOptions.ClientID:`,
	// device.DESMQTTClient.ClientOptions.ClientID)

	device.MQTTSubscription_DeviceClient_SIGAdmin().Sub(device.DESMQTTClient)

	device.MQTTSubscription_DeviceClient_SIGConfig().Sub(device.DESMQTTClient)

	device.MQTTSubscription_DeviceClient_SIGEvent().Sub(device.DESMQTTClient)

	device.MQTTSubscription_DeviceClient_SIGSample().Sub(device.DESMQTTClient)

	device.MQTTSubscription_DeviceClient_SIGDiagSample() //.Sub(device.DESMQTTClient)

	return err
}
func (device *Device) MQTTDeviceClient_Dicconnect() {

	/* UNSUBSCRIBE FROM ALL MQTTSubscriptions */
	device.MQTTSubscription_DeviceClient_SIGAdmin().UnSub(device.DESMQTTClient)

	device.MQTTSubscription_DeviceClient_SIGConfig().UnSub(device.DESMQTTClient)

	device.MQTTSubscription_DeviceClient_SIGEvent().UnSub(device.DESMQTTClient)

	device.MQTTSubscription_DeviceClient_SIGSample().UnSub(device.DESMQTTClient)

	device.MQTTSubscription_DeviceClient_SIGDiagSample() //.UnSub(device.DESMQTTClient)

	/* DISCONNECT THE DESMQTTCLient */
	device.DESMQTTClient_Disconnect()

	fmt.Printf(" (device *Device) MQTTDeviceClient_Dicconnect( ... ): Complete; OKCancel.\n")
}

/*
SUBSCRIPTIONS
*/
/* SUBSCRIPTION -> ADMINISTRATION  -> UPON RECEIPT, WRITE TO JOB DATABASE */
func (device *Device) MQTTSubscription_DeviceClient_SIGAdmin() des.MQTTSubscription {
	return des.MQTTSubscription{

		Qos:   0,
		Topic: MQTTTopic_SIGAdmin(device.DESDevSerial),
		Handler: func(c phao.Client, msg phao.Message) {
			(&AdminJDB{}).WriteMQTTAdmin(&device.Job, msg.Payload())
		},
	}
}

/* SUBSCRIPTION -> CONFIGURATION -> UPON RECEIPT, WRITE TO JOB DATABASE */
func (device *Device) MQTTSubscription_DeviceClient_SIGConfig() des.MQTTSubscription {
	return des.MQTTSubscription{

		Qos:   0,
		Topic: MQTTTopic_SIGConfig(device.DESDevSerial),
		Handler: func(c phao.Client, msg phao.Message) {
			(&ConfigJDB{}).WriteMQTTConfig(&device.Job, msg.Payload())
		},
	}
}

/* SUBSCRIPTION -> EVENT -> UPON RECEIPT, WRITE TO JOB DATABASE  */
func (device *Device) MQTTSubscription_DeviceClient_SIGEvent() des.MQTTSubscription {
	return des.MQTTSubscription{

		Qos:   0,
		Topic: MQTTTopic_SIGEvent(device.DESDevSerial),
		Handler: func(c phao.Client, msg phao.Message) {
			(&EventJDB{}).WriteMQTTEvent(&device.Job, msg.Payload())
		},
	}
}

/* SUBSCRIPTION -> SAMPLE -> UPON RECEIPT, WRITE TO JOB DATABASE  */
func (device *Device) MQTTSubscription_DeviceClient_SIGSample() des.MQTTSubscription {
	return des.MQTTSubscription{

		Qos:   0,
		Topic: MQTTTopic_SIGSample(device.DESDevSerial),
		Handler: func(c phao.Client, msg phao.Message) {
			(&Sample{}).WriteMQTTSampleMessage(&device.Job, msg.Payload())
		},
	}
}

/* SUBSCRIPTION -> DIAG SAMPLE -> UPON RECEIPT, WRITE TO JOB DATABASE */
func (device *Device) MQTTSubscription_DeviceClient_SIGDiagSample() des.MQTTSubscription {
	return des.MQTTSubscription{

		Qos:   0,
		Topic: MQTTTopic_SIGDiagSample(device.DESDevSerial),
		Handler: func(c phao.Client, msg phao.Message) {
			fmt.Println("(&DiagSample{}).WriteMQTTDiagSampleMessage(...) DOES NOT EXIST... DUMMY...")
		},
	}
}

/*
PUBLICATIONS
*/
/* PUBLICATION -> ADMINISTRATION */
func (device *Device) MQTTPublication_DeviceClient_CMDAdmin(admin AdminJDB) bool {

	cmd := des.MQTTPublication{
		Topic:    MQTTTopic_CMDAdmin(device.DESDevSerial),
		Message:  admin.MQTTMessage_CMDAdmin(),
		Retained: false,
		WaitMS:   0,
		Qos:      0,
	}

	return cmd.Pub(device.DESMQTTClient)
}

/* PUBLICATION -> CONFIGURATION */
func (device *Device) MQTTPublication_DeviceClient_CMDConfig(config ConfigJDB) bool {

	cmd := des.MQTTPublication{
		Topic:    MQTTTopic_CMDConfig(device.DESDevSerial),
		Message:  config.MQTTMessage_CMDConfig(),
		Retained: false,
		WaitMS:   0,
		Qos:      0,
	}

	return cmd.Pub(device.DESMQTTClient)
}

/* PUBLICATION -> EVENT */
func (device *Device) MQTTPublication_DeviceClient_CMDEvent(event EventJDB) bool {

	cmd := des.MQTTPublication{
		Topic:    MQTTTopic_CMDEvent(device.DESDevSerial),
		Message:  event.MQTTMessage_CMDEvent(),
		Retained: false,
		WaitMS:   0,
		Qos:      0,
	}

	return cmd.Pub(device.DESMQTTClient)
}
