package demo

import (

	// phao "github.com/eclipse/paho.mqtt.golang"
	"github.com/leehayford/go-sveltekit/pkg"
	"github.com/leehayford/go-sveltekit/pkg/des"
	cv "github.com/leehayford/go-sveltekit/pkg/c001v001"
)

// type DemoDeviceClient struct {
// 	cv.Device
// }

func (demo *DemoDeviceClient) RegisterDemoDevice(desr *des.DESRegistration) (err error) {

	// Impersonate an existing c001v001.Device
	demo.Device = cv.Device{
		DESDevice:     desr.DESDevice,
		Job:           cv.Job{DESJob: desr.DESJob},
		DESMQTTClient: des.DESMQTTClient{},
	}

	// We do NOT create a new DESevice in the DES database
	// We do Not create a new DESJob in the DES database

	if err = demo.MQTTDemoDeviceClient_Connect(); err != nil {
		return pkg.Trace(err)
	}

	// Operate the device using the UI like you're talking to the actual device

	return err

}
