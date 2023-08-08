package c001v001

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/leehayford/go-sveltekit/pkg"
)

/*
ADMIN - MQTT MESSAGE STRUCTURE
*/
type MQTTAdmin struct {
	AdmTime   int64  `json:"adm_time"`
	AdmAddr   string `json:"adm_addr"`
	AdmUserID int64  `json:"adm_user_id"`
	AdmApp    string `json:"adm_app"`

	/*BROKER*/
	AdmDefHost string `json:"adm_def_host"`
	AdmDefPort int32  `json:"adm_def_port"`
	AdmOpHost  string `json:"adm_op_host"`
	AdmOpsPort int32  `json:"adm_op_port"`

	/*DEVICE*/
	AdmClass   string `json:"adm_class"`
	AdmVersion string `json:"adm_version"`
	AdmSerial  string `json:"adm_serial"`

	/*BATTERY ALARMS*/
	AdmBatHiAmp  float32 `json:"adm_bat_hi_amp"`
	AdmBatLoVolt float32 `json:"adm_bat_lo_volt"`

	/*MOTOR ALARMS*/
	AdmMotHiAmp float32 `json:"adm_mot_hi_amp"`

	// /* POSTURE - NOT IMPLEMENTED */
	// AdmTiltTgt float32 `json:"adm_tilt_tgt"` // 90.0 °
	// AdmTiltMgn float32 `json:"adm_tilt_mgn"` // 3.0 °
	// AdmAzimTgt float32 `json:"adm_azim_tgt"` // 180.0 °
	// AdmAzimMgn float32 `json:"adm_azim_mgn"` // 3.0 °

	/* HIGH FLOW SENSOR ( HFS )*/
	AdmHFSFlow     float32 `json:"adm_hfs_flow"`      // 200.0 L/min
	AdmHFSFlowMin  float32 `json:"adm_hfs_flow_min"`  // 150.0 L/min
	AdmHFSFlowMax  float32 `json:"adm_hfs_flow_max"`  //  250.0 L/min
	AdmHFSPress    float32 `json:"adm_hfs_press"`     // 160.0 psia
	AdmHFSPressMin float32 `json:"adm_hfs_press_min"` //  23.0 psia
	AdmHFSPressMax float32 `json:"adm_hfs_press_max"` //  200.0 psia
	AdmHFSDiff     float32 `json:"adm_hfs_diff"`      //  65.0 psi
	AdmHFSDiffMin  float32 `json:"adm_hfs_diff_min"`  //  10.0 psi
	AdmHFSDiffMax  float32 `json:"adm_hfs_diff_max"`  //  75.0 psi

	/* LOW FLOW SENSOR ( LFS )*/
	AdmLFSFlow     float32 `json:"adm_lfs_flow"`      // 1.85 L/min
	AdmLFSFlowMin  float32 `json:"adm_lfs_flow_min"`  // 0.5 L/min
	AdmLFSFlowMax  float32 `json:"adm_lfs_flow_max"`  // 2.0 L/min
	AdmLFSPress    float32 `json:"adm_lfs_press"`     // 60.0 psia
	AdmLFSPressMin float32 `json:"adm_lfs_press_min"` // 20.0 psia
	AdmLFSPressMax float32 `json:"adm_lfs_press_max"` // 80.0 psia
	AdmLFSDiff     float32 `json:"adm_lfs_diff"`      // 9.0 psi
	AdmLFSDiffMin  float32 `json:"adm_lfs_diff_min"`  // 2.0 psi
	AdmLFSDiffMax  float32 `json:"adm_lfs_diff_max"`  // 10.0 psi

}

/* SIG TOPICS - ADMINISTRATION */
func MQTTTopic_SIGAdmin(serial string) (topic string) {
	return fmt.Sprintf("%s/%s/%s/sig/admin",
		DEVICE_CLASS,
		DEVICE_VERSION,
		serial,
	)
}

/* SIG MESSAGE LOGGER - ADMIN */
func (adm *AdminJDB) WriteMQTTAdmin(job *Job, msg []byte) (err error) {

	// Unpack the Config message into a Config JDB
	if err = json.Unmarshal(msg, adm); err != nil {
		return pkg.Trace(err)
	}

	// Write the ConfigJDB to the job database
	if err = adm.WriteAdmin(job); err != nil {
		return err
	}
	return err
}

/* SIG MESSAGE SSE SHIPPER - ADMIN */
func (adm *AdminJDB) SendSSEAdmin(job *Job, chOut chan string, msg []byte) (err error) {
			/* WRANGLE SSE DATA */
			if err := json.Unmarshal(msg, &adm); err != nil {
				pkg.Trace(err)
			}
			/*
			 WAIT FOR THE DEVICE CLIENT SUBSCRIPTION HANDLER TO LOG THE MESSAGE 
				- GO GET IT FROM THE JDB
			 	- SO WE CAN SHIP IT WITH A VALID D ( != 0 )
			 */
			time.Sleep(time.Millisecond * 500)
			adm.GetAdminByTime(job, adm.AdmTime)
			js, err := json.Marshal(adm)
			if err != nil {
				pkg.Trace(err)
			}

			pkg.Json("(adm *AdminJDB) SendSSEAdmin(...) -> adm.GetAdminByTime(...) -> adm :", adm)
			/* SEND SSE DATA */
			chOut <- string(js)

	return err 
}

/* CMD TOPICS - ADMINISTRATION */
func MQTTTopic_CMDAdmin(serial string) (topic string) {
	return fmt.Sprintf("%s/%s/%s/cmd/admin",
		DEVICE_CLASS,
		DEVICE_VERSION,
		serial,
	)
}

/* CMD MESSAGE CONSTRUCTORS - ADMINISTRATION */
func (adm *MQTTAdmin) MQTTMessage_CMDAdmin() string {
	msg, err := json.Marshal(adm)
	if err != nil {
		pkg.Trace(err)
	}
	return string(msg)
}
