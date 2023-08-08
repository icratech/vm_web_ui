package c001v001

import (
	"fmt"

	"github.com/leehayford/go-sveltekit/pkg"
	"github.com/leehayford/go-sveltekit/pkg/des"
)

const DEVICE_CLASS = "001"
const DEVICE_VERSION = "001"

type Device struct {
	Job `json:"job"` // The active job for this device ( last job if it has ended )
	des.DESDevice
	des.DESMQTTClient
}

/*
USED WHEN DATACAN ADMIN WEB CLIENTS REGISTER NEW C001V001 DEVICES ON THIS DES
PERFORMS DES DECE REGISTRATION
PERFORMS CLASS/VERSION SPECIFIC REGISTRATION ACTIONS
*/
func (device *Device) RegisterDevice(des_reg *des.DESRegistration) (err error) {

	/*
		CREATE A DEVICE RECORD IN THE DES DB FOR THIS DEVICE
		 - Creates a new DESevice in the DES database
		 - Gets the C001V001Device's DeviceID from the DES Database
	*/
	device.DESDevice = des_reg.DESDevice
	if err = device.RegisterDESDevice(); err != nil {
		return pkg.Trace(err)
	}
	pkg.Json(`(device *Device)RegisterDevice(...) -> device.RegisterDESDevice()
	device.DESDevice:`,
		device.DESDevice)

	/*
		CREATE THE DEFAULT JOB FOR THIS DEVICE
		 - SERIALNUM-0000000000000000
		 - Create the registration job record in the DES database
		 - Create a new Job database for the job data
		 - Sets the the Device's active job
		 -
	*/
	des_reg.DESJob = des.DESJob{

		DESJobRegTime:   device.DESDevRegTime,
		DESJobRegAddr:   device.DESDevRegAddr,
		DESJobRegUesrID: device.DESDevRegUesrID,
		DESJobRegApp:    device.DESDevRegApp,

		DESJobName:      fmt.Sprintf("%s_0000000000000000", device.DESDevSerial),
		DESJobStart:     device.DESDevRegTime,
		DESJobEnd:       0,

		DESJobDevID:     device.DESDevID,
	}
	device.Job = Job{
		LastAdmin:  DeviceRegistration_DefaultAdmin(des_reg),
		LastConfig: DeviceRegistration_DefaultConfig(des_reg),
		LastEvent:  DeviceRegistration_Event(des_reg),
		LastSample: Sample{},
		DESJob:     des_reg.DESJob,
	}
	if err = device.Job.RegisterJob(); err != nil {
		return pkg.Trace(err)
	}
	// pkg.Json(`(device *Device)RegisterDevice(...) -> device.Job.RegisterDESJob()
	// device.Job:`,
	// 	device.Job)

	/*
		CONNECT THE MQTTDeviceClient FOR THIS DEVICE
	*/
	device.DESMQTTClient = des.DESMQTTClient{}
	if err = device.MQTTDeviceClient_Connect(); err != nil {
		return pkg.Trace(err)
	}
	// pkg.Json(`(device *Device)RegisterDevice(...) -> device.RegisterMQTTDeviceClient( )
	// device.DESMQTTClient.ClientID:`,
	// 	device.DESMQTTClient.ClientID)

	des_reg.DESDevice = device.DESDevice
	des_reg.DESJob = device.DESJob
	return err
}

func DeviceRegistration_Event(des_reg *des.DESRegistration) EventJDB {
	return EventJDB{
		EvtID: int64(1),
		MQTTEvent: MQTTEvent{
			des_reg.DESDevRegTime,
			des_reg.DESDevRegAddr,
			des_reg.DESDevRegUesrID,
			des_reg.DESDevRegApp,
			REGISTER_DEVICE_EVENT_TYPE_ID,
			"A Device is Born",
			"Congratulations, it's a c001v001...",
		},
	}
}

func DeviceRegistration_DefaultAdmin(des_reg *des.DESRegistration) AdminJDB {
	return AdminJDB{
		AdmID: 0,
		MQTTAdmin: MQTTAdmin{
			AdmTime:   des_reg.DESDevRegTime,
			AdmAddr:   des_reg.DESDevRegAddr,
			AdmUserID: des_reg.DESDevRegUesrID,
			AdmApp:    des_reg.DESDevRegApp,

			/* BROKER */
			AdmDefHost: pkg.BROKER_HOST,
			AdmDefPort: pkg.BROKER_PORT,
			AdmOpHost:  pkg.BROKER_HOST,
			AdmOpsPort: pkg.BROKER_PORT,

			/* DEVICE */
			AdmClass:   DEVICE_CLASS,
			AdmVersion: DEVICE_VERSION,
			AdmSerial:  des_reg.DESDevSerial,

			/* BATTERY */
			AdmBatHiAmp:  2.5,  // Amps
			AdmBatLoVolt: 10.5, // Volts

			/* MOTOR */
			AdmMotHiAmp: 1.9, // Volts

			// /* POSTURE - NOT IMPLEMENTED */
			// TiltTarget float32 `json:"tilt_target"` // 90.0 °
			// TiltMargin float32 `json:"tilt_margin"` // 3.0 °
			// AzimTarget float32 `json:"azim_target"` // 180.0 °
			// AzimMargin float32 `json:"azim_margin"` // 3.0 °

			/* HIGH FLOW SENSOR ( HFS )*/
			AdmHFSFlow:     200.0, // 200.0 L/min
			AdmHFSFlowMin:  150.0, // 150.0 L/min
			AdmHFSFlowMax:  250.0, //  250.0 L/min
			AdmHFSPress:    160.0, // 160.0 psia
			AdmHFSPressMin: 23,    //  23.0 psia
			AdmHFSPressMax: 200.0, //  200.0 psia
			AdmHFSDiff:     65.0,  //  65.0 psi
			AdmHFSDiffMin:  10.0,  //  10.0 psi
			AdmHFSDiffMax:  75.0,  //  75.0 psi

			/* LOW FLOW SENSOR ( LFS )*/
			AdmLFSFlow:     1.85, // 1.85 L/min
			AdmLFSFlowMin:  0.5,  // 0.5 L/min
			AdmLFSFlowMax:  2.0,  // 2.0 L/min
			AdmLFSPress:    60.0, // 60.0 psia
			AdmLFSPressMin: 20.0, // 20.0 psia
			AdmLFSPressMax: 800,  // 80.0 psia
			AdmLFSDiff:     9.0,  // 9.0 psi
			AdmLFSDiffMin:  2.0,  // 2.0 psi
			AdmLFSDiffMax:  10.0, // 10.0 psi
		},
	}
}

func DeviceRegistration_DefaultConfig(des_reg *des.DESRegistration) ConfigJDB {
	return ConfigJDB{
		CfgID: 0,

		MQTTConfig: MQTTConfig{

			CfgTime:   des_reg.DESDevRegTime,
			CfgAddr:   des_reg.DESDevRegAddr,
			CfgUserID: des_reg.DESDevRegUesrID,
			CfgApp:    des_reg.DESDevRegApp,
			/* JOB */
			CfgJobName:  des_reg.DESJobName,
			CfgJobStart: des_reg.DESDevRegTime,
			CfgJobEnd:   0,
			CfgSCVD:     596.8, // m
			CfgSCVDMult: 10.5,  // kPa / m
			CfgSSPRate:  1.95,  // kPa / hour
			CfgSSPDur:   6.0,   // hour
			CfgHiSCVF:   201.4, //  L/min

			/* VALVE */
			CfgVlvTgt: 2, // vent
			CfgVlvPos: 2, // vent

			/* OP PERIODS*/
			CfgOpLog:    10000, // millisecond
			CfgOpTrans:  60000, // millisecond
			CfgOpSample: 1000,  // millisecond

			/* DIAG PERIODS */
			CfgDiagLog:    100000, // millisecond
			CfgDiagTrans:  600000, // millisecond
			CfgDiagSample: 10000,  // millisecond
		},
	}
}

/* MQTT SIG TOPICS -> SAMPLE   */
func MQTTTopic_SIGSample(serial string) (topic string) {
	return fmt.Sprintf("%s/%s/%s/sig/sample",
		DEVICE_CLASS,
		DEVICE_VERSION,
		serial,
	)
}
func MQTTTopic_SIGDiagSample(serial string) (topic string) {
	return fmt.Sprintf("%s/%s/%s/sig/diag_sample",
		DEVICE_CLASS,
		DEVICE_VERSION,
		serial,
	)
}

/* MQTT CMD TOPICS -> ADMINISTRATION   */
