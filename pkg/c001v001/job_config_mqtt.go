package c001v001

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/leehayford/go-sveltekit/pkg"
)

/*
CONFIG - MQTT MESSAGE STRUCTURE
*/
type MQTTConfig struct {
	CfgTime   int64  `json:"cfg_time"`
	CfgAddr   string `json:"cfg_addr"`
	CfgUserID int64  `json:"cfg_user_id"`
	CfgApp    string `json:"cfg_app"`

	/*JOB*/
	CfgJobName  string  `json:"cfg_job_name"`
	CfgJobStart int64   `json:"cfg_job_start"`
	CfgJobEnd   int64   `json:"cfg_job_end"`
	CfgSCVD     float32 `json:"cfg_scvd"`
	CfgSCVDMult float32 `json:"cfg_scvd_mult"`
	CfgSSPRate  float32 `json:"cfg_ssp_rate"`
	CfgSSPDur   float32 `json:"cfg_ssp_dur"`
	CfgHiSCVF   float32 `json:"cfg_hi_scvf"`
	CfgFlowTog  float32 `json:"cfg_flow_tog"`

	/*VALVE*/
	CfgVlvTgt int32 `json:"cfg_vlv_tgt"`
	CfgVlvPos int32 `json:"cfg_vlv_pos"`

	/*OP PERIODS*/
	CfgOpSample int32 `json:"cfg_op_sample"`
	CfgOpLog    int32 `json:"cfg_op_log"`
	CfgOpTrans  int32 `json:"cfg_op_trans"`

	/*DIAG PERIODS*/
	CfgDiagSample int32 `json:"cfg_diag_sample"`
	CfgDiagLog    int32 `json:"cfg_diag_log"`
	CfgDiagTrans  int32 `json:"cfg_diag_trans"`
}

/* SIG TOPICS - CONFIGURATION */
func MQTTTopic_SIGConfig(serial string) (topic string) {
	return fmt.Sprintf("%s/%s/%s/sig/config",
		DEVICE_CLASS,
		DEVICE_VERSION,
		serial,
	)
}

/* SIG MESSAGE LOGGER - CONFIG */
func (cfg *ConfigJDB) WriteMQTTConfig(job *Job, msg []byte) (err error) {

	// Unpack the Config message into an ConfigDB
	if err = json.Unmarshal(msg, cfg); err != nil {
		return pkg.Trace(err)
	}

	// Write the ConfigJDB to the job database
	if err = cfg.WriteConfig(job); err != nil {
		return err
	}
	return err
}


/* SIG MESSAGE SSE SHIPPER - CONFIG */
func (cfg *ConfigJDB) SendSSEConfig(job *Job, chOut chan string, msg []byte) (err error) {
	/* WRANGLE SSE DATA */
	if err := json.Unmarshal(msg, &cfg); err != nil {
		pkg.Trace(err)
	}
	/*
		WAIT FOR THE DEVICE CLIENT SUBSCRIPTION HANDLER TO LOG THE MESSAGE 
		- GO GET IT FROM THE JDB
			- SO WE CAN SHIP IT WITH A VALID D ( != 0 )
		*/
	time.Sleep(time.Millisecond * 500)
	cfg.GetConfigByTime(job, cfg.CfgTime)
	js, err := json.Marshal(cfg)
	if err != nil {
		pkg.Trace(err)
	}

	pkg.Json("(cfg *ConfigJDB) SendSSEConfig(...) -> cfg.GetConfigByTime -> cfg :", cfg)
	/* SEND SSE DATA */
	chOut <- string(js)
	return err
}


/* CMD TOPICS - CONFIGURATION  */
func MQTTTopic_CMDConfig(serial string) (topic string) {
	return fmt.Sprintf("%s/%s/%s/cmd/config",
		DEVICE_CLASS,
		DEVICE_VERSION,
		serial,
	)
}

/* CMD MESSAGE CONSTRUCTORS - CONFIGURATION */
func (cfg *MQTTConfig) MQTTMessage_CMDConfig() string {
	msg, err := json.Marshal(cfg)
	if err != nil {
		pkg.Trace(err)
	}
	return string(msg)
}
