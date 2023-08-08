package c001v001

import (
	"encoding/binary"
	"encoding/json"
	// "fmt"

	"github.com/leehayford/go-sveltekit/pkg"
)

/* SAMPLE - AS RECEIVED FROM DEVICE ON MQTTTopic_SIGSample */
type MQTTSample struct {
	JobID string   `json:"job_id"`
	Data  []string `json:"data"`
}

func (sample *Sample) WriteMQTTSampleMessage(job *Job, msg []byte) (err error) {

	// Decode the payload into an MQTTSampleMessage
	mqtts := &MQTTSample{}
	if err = json.Unmarshal(msg, &mqtts); err != nil {
		return pkg.Trace(err)
	} // pkg.Json("DecodeMQTTSampleMessage(...) ->  msg :", msg)

	for _, b64 := range mqtts.Data {

		// Decode base64 string
		sample = &Sample{SmpJobName: mqtts.JobID}
		if err = sample.DecodeMQTTSampleData(b64); err != nil {
			return err
		}

		// Write the Sample to the job database
		if err = sample.WriteSample(job); err != nil {
			return err
		}
	}

	return err
}
func (sample *Sample) DecodeMQTTSampleData(b64 string) (err error) {

	bytes := pkg.Base64ToBytes(b64)

	sample.SmpTime = int64(binary.BigEndian.Uint64(bytes[0:8]))
	sample.SmpCH4 = pkg.BytesToFloat32(bytes[8:12])
	sample.SmpHiFlow = pkg.BytesToFloat32(bytes[12:16])
	sample.SmpLoFlow = pkg.BytesToFloat32(bytes[16:20])
	sample.SmpPress = pkg.BytesToFloat32(bytes[20:24])
	sample.SmpBatAmp = pkg.BytesToFloat32(bytes[24:28])
	sample.SmpBatVolt = pkg.BytesToFloat32(bytes[28:32])
	sample.SmpMotVolt = pkg.BytesToFloat32(bytes[32:36])
	sample.SmpVlvTgt = pkg.BytesToUInt32(bytes[36:38])
	sample.SmpVlvPos = pkg.BytesToUInt32(bytes[38:40])

	// pkg.Json("DecodeMQTTSampleData(...) ->  sample:", sample)

	return err
}

/*
	SAMPLE - AS SENT TO MQTTDeviceUserClient VIA SSE

USED FOR UPDATING CHART WITH TIMESERIES DATA ->
[ { x: 1689533399789525, y: 9.99999 }, ]
*/
type XYSample struct {
	JobID          string       `json:"job_id"`
	CH4            pkg.TSDPoint `json:"ch4"`
	HighFlow       pkg.TSDPoint `json:"high_flow"`
	LowFlow        pkg.TSDPoint `json:"low_flow"`
	Pressure       pkg.TSDPoint `json:"pressure"`
	BatteryCurrent pkg.TSDPoint `json:"battery_current"`
	BatteryVoltage pkg.TSDPoint `json:"battery_voltage"`
	MotorVoltage   pkg.TSDPoint `json:"motor_voltage"`
	ValveTarget    pkg.TSDPoint `json:"valve_target"`
	ValvePosition  pkg.TSDPoint `json:"valve_position"`
}

func (sample *Sample) EncodeXYSample() XYSample {
	return XYSample{
		sample.SmpJobName,
		pkg.TSDPoint{X: sample.SmpTime, Y: sample.SmpCH4},
		pkg.TSDPoint{X: sample.SmpTime, Y: sample.SmpHiFlow},
		pkg.TSDPoint{X: sample.SmpTime, Y: sample.SmpLoFlow},
		pkg.TSDPoint{X: sample.SmpTime, Y: sample.SmpPress},
		pkg.TSDPoint{X: sample.SmpTime, Y: sample.SmpBatAmp},
		pkg.TSDPoint{X: sample.SmpTime, Y: sample.SmpBatVolt},
		pkg.TSDPoint{X: sample.SmpTime, Y: sample.SmpMotVolt},
		pkg.TSDPoint{X: sample.SmpTime, Y: float32(sample.SmpVlvTgt)},
		pkg.TSDPoint{X: sample.SmpTime, Y: float32(sample.SmpVlvPos)},
	}
}

type SSESample struct {
	Type string `json:"type"`
	Data Sample `json:"data"`
}

/* WRANGLE AND SEND SSE DATA */
func (sample *Sample) SendSSESamples(sampleChan chan string, msg []byte) (err error) {

	// Decode the payload into an MQTTSampleMessage
	mqtts := &MQTTSample{}
	if err = json.Unmarshal(msg, &mqtts); err != nil {
		return pkg.Trace(err)
	} // pkg.Json("DecodeMQTTSampleMessage(...) ->  msg :", msg)

	for _, b64 := range mqtts.Data {

		// Decode base64 string
		sample = &Sample{SmpJobName: mqtts.JobID}
		if err = sample.DecodeMQTTSampleData(b64); err != nil {
			return err
		}

		// Create a JSON version thereof
		js, err := json.Marshal(&SSESample{Type: "sample",Data: *sample,})
		if err != nil {
			return pkg.Trace(err)
		}

		// Ship it
		sampleChan <- string(js)

	}

	return err
}
