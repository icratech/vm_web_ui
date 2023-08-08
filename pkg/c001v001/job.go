package c001v001

import (
	"fmt"

	"github.com/leehayford/go-sveltekit/pkg"
	"github.com/leehayford/go-sveltekit/pkg/des"
)

type Job struct {
	LastAdmin  AdminJDB  `json:"last_admin"`   // Last known device Administratin settings
	LastConfig ConfigJDB `json:"last_coinfig"` // Last known device Configuration settings
	LastEvent  EventJDB  `json:"last_event"`   // Last known Event
	LastSample Sample    `json:"last_sample"`  // Last known Sample
	// LastDiagSample DiagSample      `json:"last_diag_sample"` // Last known DiagSample
	des.DESJob // Data Exchange Server main database
}

/* Create a client for all registered devices */
func MQTTDeviceClient_CreateAndConnectAll() (err error) {

	drs, err := (&des.DESRegistration{}).GetActiveDevices()
	if err != nil {
		return pkg.Trace(err)
	}

	for _, dr := range drs {
		device := Device{
			DESDevice:     dr.DESDevice,
			Job:           Job{DESJob: dr.DESJob},
			DESMQTTClient: des.DESMQTTClient{},
		}
		if err = device.MQTTDeviceClient_Connect(); err != nil {
			return pkg.Trace(err)
		}
	}

	return err
}


func (job *Job) RegisterJob() (err error) {

	// fmt.Printf("\n(job *Job) RegisterJob(...)\n")

	if err = job.RegisterDESJob(); err != nil {
		return err
	} 
	pkg.Json("(job *Job) RegisterJob(...) -> job.RegisterDESJob( ) -> job.DESJob:", job.DESJob)

	job.JDB().Create(job.DESJobName, true,[]string{
			CREATE_EVENT_TYPE_TABLE,
			INSERT_EVENT_TYPE_ADMIN_REGISTER_DEVICE,
			INSERT_EVENT_TYPE_CONFIG_JOB_START,
			INSERT_EVENT_TYPE_CONFIG_JOB_END,
			INSERT_EVENT_TYPE_CONFIG_CHANGE,
			INSERT_EVENT_TYPE_SSP,
			INSERT_EVENT_TYPE_ALARM_HIGH_CURRENT,
			INSERT_EVENT_TYPE_ALARM_LOW_VOLTAGE,
			INSERT_EVENT_TYPE_ALARM_HIGH_PRESSURE,
			INSERT_EVENT_TYPE_ALARM_HIGH_FLOW,
			INSERT_EVENT_TYPE_MODE_VENT,
			INSERT_EVENT_TYPE_MODE_BUILD,
			INSERT_EVENT_TYPE_MODE_HIGH_FLOW,
			INSERT_EVENT_TYPE_MODE_LOW_FLOW,

			// CREATE_HEADER_TABLE,
			CREATE_ADMIN_TABLE,
			CREATE_CONFIG_TABLE,
			CREATE_EVENT_TABLE,
			CREATE_SAMPLES_TABLE,
			// CREATE_DIAG_TABLE,
		},
	)

	/* TODO: CREATE ADMIN TABLE */
	// Create a record in the Job Database - Admin Table
	// fmt.Printf("(job *Job) RegisterJob(...) writing admin...")
	if err = job.LastAdmin.WriteAdmin(job); err != nil {
		return err
	}
	// Go get it; ConfigID should != 0
	if err = job.GetLastAdmin(); err != nil {
		return err
	}
	// fmt.Printf("(job *Job) RegisterJob(...) writing admin done.")

	/* TODO: CREATE CONFIG TABLE */
	// Create a record in the Job Database - Config Table
	if err = job.LastConfig.WriteConfig(job); err != nil {
		return err
	}
	// Go get it; ConfigID should != 0
	if err = job.GetLastConfig(); err != nil {
		return err
	}

	// Create a record in the Job Database - Event Table
	if err = job.LastEvent.WriteEvent(job); err != nil {
		return err
	}
	// Go get it; EventID should != 0
	if err = job.GetLastEvent(); err != nil {
		return err
	} 
	pkg.Json(`(job *Job) RegisterJob(...) -> job.LastEvent.WriteEvent( ) -> job.GetLastEvent( ) -> job.LastEvent:`, job.LastEvent)

	return err
}

/* ADMIN */
func (job *Job) GetLastAdmin() (err error) {
	q := `SELECT DISTINCT * FROM admin 
	WHERE adm_time = ( 
		SELECT MAX( adm_time ) FROM admin 
	) 
	ORDER BY adm_time DESC`
	p := []interface{}{}
	return job.LastAdmin.GetAdmin(job, q, p)
}

/* CONFIG */
func (job *Job) GetLastConfig() (err error) {
	q := `SELECT DISTINCT * FROM config 
	WHERE cfg_time = ( 
		SELECT MAX( cfg_time ) FROM config 
	) 
	ORDER BY cfg_time DESC`
	p := []interface{}{}
	return job.LastConfig.GetConfig(job, q, p)
}

/* EVENT */
func (job *Job) GetLastEvent() (err error) {
	q := `SELECT DISTINCT * FROM event 
	WHERE evt_time = ( 
		SELECT MAX( evt_time ) FROM event 
	) 
	ORDER BY evt_time DESC`
	p := []interface{}{}
	return job.LastEvent.GetEvent(job, q, p)
}

/* SAMPLE*/
func (job *Job) GetLastSample() (err error) {
	q := `SELECT DISTINCT * FROM sample 
	WHERE smp_time = ( 
		SELECT MAX( smp_time ) FROM sample 
	) 
	ORDER BY smp_time DESC`
	p := []interface{}{}
	return job.LastSample.GetSample(job, q, p)
}

type XYDatasets struct {
	CH4     []des.XYPoint `json:"ch4"`
	HiFlow  []des.XYPoint `json:"hi_flow"`
	LoFlow  []des.XYPoint `json:"lo_flow"`
	Press   []des.XYPoint `json:"press"`
	BatAmp  []des.XYPoint `json:"bat_amp"`
	BatVolt []des.XYPoint `json:"bat_volt"`
	MotVolt []des.XYPoint `json:"mot_volt"`
	VlvTgt  []des.XYPoint `json:"vlv_tgt"`
	VlvPos  []des.XYPoint `json:"vlv_pos"`
}

func (xyd *XYDatasets) AppendSample(smp Sample) {
	xyd.CH4 = append(xyd.CH4, des.XYPoint{X: smp.SmpTime, Y: smp.SmpCH4})
	xyd.HiFlow = append(xyd.HiFlow, des.XYPoint{X: smp.SmpTime, Y: smp.SmpHiFlow})
	xyd.LoFlow = append(xyd.LoFlow, des.XYPoint{X: smp.SmpTime, Y: smp.SmpLoFlow})
	xyd.Press = append(xyd.Press, des.XYPoint{X: smp.SmpTime, Y: smp.SmpPress})
	xyd.BatAmp = append(xyd.BatAmp, des.XYPoint{X: smp.SmpTime, Y: smp.SmpBatAmp})
	xyd.BatVolt = append(xyd.BatVolt, des.XYPoint{X: smp.SmpTime, Y: smp.SmpBatVolt})
	xyd.MotVolt = append(xyd.MotVolt, des.XYPoint{X: smp.SmpTime, Y: smp.SmpMotVolt})
	xyd.VlvTgt = append(xyd.VlvTgt, des.XYPoint{X: smp.SmpTime, Y: float32(smp.SmpVlvTgt)})
	xyd.VlvPos = append(xyd.VlvPos, des.XYPoint{X: smp.SmpTime, Y: float32(smp.SmpVlvPos)})
}

type JobData struct {
	Admins              []AdminJDB  `json:"admins"`
	Configs             []ConfigJDB `json:"configs"`
	Events              []EventJDB  `json:"events"`
	Samples             []Sample    `json:"samples"`
	XYSmp               XYDatasets  `json:"xy_smp"`
	des.DESRegistration `json:"des_reg"`
}

func (job_data *JobData) GetJobData() (err error) {

	if err = job_data.GetAdmins_All(); err != nil {
		return err
	}

	if err = job_data.GetConfigs_All(); err != nil {
		return err
	}

	if err = job_data.GetEvents_All(); err != nil {
		return err
	}

	if err = job_data.GetSamples_All(); err != nil {
		// if err = job_data.GetSamples_Preview( ); err != nil {
		return err
	}

	for _, smp := range job_data.Samples {
		job_data.XYSmp.AppendSample(smp)
	}

	return err
}

func (job_data *JobData) GetJobStats() (err error) {
	fmt.Printf("\n(job_data *JobData) GetJobStats(...)\n")

	if err = job_data.GetLastAdmin(); err != nil {
		return pkg.Trace(err)
	}
	// pkg.Json("\n(job_data *JobData) GetJobStats(...) -> job_data.GetLastAdmin(  ):\n%s\n\n", job_data.Admins)

	if err = job_data.GetLastConfig(); err != nil {
		return pkg.Trace(err)
	}
	// pkg.Json("\n(job_data *JobData) GetJobStats(...) -> job_data.GetLastConfig(  ):\n%s\n\n", job_data.Configs)

	if err = job_data.GetLastEvent(); err != nil {
		return pkg.Trace(err)
	}
	// pkg.Json("\n(job_data *JobData) GetJobStats(...) -> job_data.GetLastEvent(  ):\n%s\n\n", job_data.Events)

	if err = job_data.GetLastSample(); err != nil {
		return pkg.Trace(err)
	}
	// pkg.Json("\n(job_data *JobData) GetJobStats(...) -> job_data.GetLastSample(  ):\n%s\n\n", job_data.Samples)

	for _, smp := range job_data.Samples {
		job_data.XYSmp.AppendSample(smp)
	}

	return err
}

/* ADMINS */
func (job_data *JobData) GetAdmins(qry string, params []interface{}) (err error) {

	rows, err := job_data.JDB().Select(qry, params)
	if err != nil {
		pkg.Trace(err)
	}
	defer rows.Close()

	for rows.Next() {
		adm := AdminJDB{}
		err = rows.Scan(
			&adm.AdmID,

			&adm.AdmTime,
			&adm.AdmAddr,
			&adm.AdmUserID,
			&adm.AdmApp,

			&adm.AdmDefHost,
			&adm.AdmDefPort,
			&adm.AdmOpHost,
			&adm.AdmOpsPort,

			&adm.AdmClass,
			&adm.AdmVersion,

			&adm.AdmSerial,

			&adm.AdmBatHiAmp,
			&adm.AdmBatLoVolt,
			&adm.AdmMotHiAmp,

			&adm.AdmHFSFlow,
			&adm.AdmHFSFlowMin,
			&adm.AdmHFSFlowMax,
			&adm.AdmHFSPress,
			&adm.AdmHFSPressMin,
			&adm.AdmHFSPressMax,
			&adm.AdmHFSDiff,
			&adm.AdmHFSDiffMin,
			&adm.AdmHFSDiffMax,

			&adm.AdmLFSFlow,
			&adm.AdmLFSFlowMin,
			&adm.AdmLFSFlowMax,
			&adm.AdmLFSPress,
			&adm.AdmLFSPressMin,
			&adm.AdmLFSPressMax,
			&adm.AdmLFSDiff,
			&adm.AdmLFSDiffMin,
			&adm.AdmLFSDiffMax,
		)
		if err != nil {
			pkg.Trace(err)
		}
		job_data.Admins = append(job_data.Admins, adm)
	}

	return err
}
func (job_data *JobData) GetAdmins_All() (err error) {
	q := `SELECT * FROM admin ORDER BY adm_time DESC`
	p := []interface{}{}
	return job_data.GetAdmins(q, p)
}
func (job_data *JobData) GetLastAdmin() (err error) {
	q := `SELECT DISTINCT * FROM admin 
	WHERE adm_time = ( 
		SELECT MAX( adm_time ) FROM admin 
	) 
	ORDER BY adm_time DESC`
	p := []interface{}{}
	return job_data.GetAdmins(q, p)
}

/* CONFIGS */
func (job_data *JobData) GetConfigs(qry string, params []interface{}) (err error) {

	rows, err := job_data.JDB().Select(qry, params)
	if err != nil {
		pkg.Trace(err)
	}
	defer rows.Close()

	for rows.Next() {
		cfg := ConfigJDB{}
		err = rows.Scan(
			&cfg.CfgID,

			&cfg.CfgTime,
			&cfg.CfgAddr,
			&cfg.CfgUserID,
			&cfg.CfgApp,

			&cfg.CfgJobName,
			&cfg.CfgJobStart,
			&cfg.CfgJobEnd,
			&cfg.CfgSCVD,
			&cfg.CfgSCVDMult,
			&cfg.CfgSSPRate,
			&cfg.CfgSSPDur,
			&cfg.CfgHiSCVF,
			&cfg.CfgFlowTog,

			&cfg.CfgVlvTgt,
			&cfg.CfgVlvPos,

			&cfg.CfgOpSample,
			&cfg.CfgOpLog,
			&cfg.CfgOpTrans,

			&cfg.CfgDiagSample,
			&cfg.CfgDiagLog,
			&cfg.CfgDiagTrans,
		)
		if err != nil {
			pkg.Trace(err)
		}
		job_data.Configs = append(job_data.Configs, cfg)
	}

	return err
}
func (job_data *JobData) GetConfigs_All() (err error) {
	q := `SELECT * FROM config ORDER BY cfg_time DESC`
	p := []interface{}{}
	return job_data.GetConfigs(q, p)
}
func (job_data *JobData) GetLastConfig() (err error) {
	q := `SELECT DISTINCT * FROM config 
	WHERE cfg_time = ( 
		SELECT MAX( cfg_time ) FROM config 
	) 
	ORDER BY cfg_time DESC`
	p := []interface{}{}
	return job_data.GetConfigs(q, p)
}

/* EVENTS */
func (job_data *JobData) GetEvents(qry string, params []interface{}) (err error) {

	rows, err := job_data.JDB().Select(qry, params)
	if err != nil {
		pkg.Trace(err)
	}
	defer rows.Close()

	for rows.Next() {
		evt := EventJDB{}
		err = rows.Scan(
			&evt.EvtID,
			&evt.EvtTime,
			&evt.EvtAddr,
			&evt.EvtUserID,
			&evt.EvtApp,
			&evt.EvtTypeID,
			&evt.EvtTitle,
			&evt.EvtMsg,
		)
		if err != nil {
			pkg.Trace(err)
		}
		job_data.Events = append(job_data.Events, evt)
	}
	return err
}
func (job_data *JobData) GetEvents_All() (err error) {
	q := `SELECT * FROM event ORDER BY evt_time DESC`
	p := []interface{}{}
	return job_data.GetEvents(q, p)
}
func (job_data *JobData) GetLastEvent() (err error) {
	q := `SELECT DISTINCT * FROM event 
	WHERE evt_time = ( 
		SELECT MAX( evt_time ) FROM event 
	) 
	ORDER BY evt_time DESC`
	p := []interface{}{}
	return job_data.GetEvents(q, p)
}

/* SAMPLES*/
func (job_data *JobData) GetSamples(qry string, params []interface{}) (err error) {

	rows, err := job_data.JDB().Select(qry, params)
	if err != nil {
		pkg.Trace(err)
	}
	defer rows.Close()

	for rows.Next() {
		var smp Sample
		err = rows.Scan(
			&smp.SmpID,
			&smp.SmpTime,
			&smp.SmpCH4,
			&smp.SmpHiFlow,
			&smp.SmpLoFlow,
			&smp.SmpPress,
			&smp.SmpBatAmp,
			&smp.SmpBatVolt,
			&smp.SmpMotVolt,
			&smp.SmpVlvTgt,
			&smp.SmpVlvPos,
			&smp.SmpJobName,
		)
		if err != nil {
			pkg.Trace(err)
		}
		job_data.Samples = append(job_data.Samples, smp)
	}
	return err
}
func (job_data *JobData) GetSamples_All() (err error) {
	q := `SELECT * FROM sample`
	p := []interface{}{}
	return job_data.GetSamples(q, p)
}
func (job_data *JobData) GetNSamples(n int) (err error) {
	q := `SELECT * FROM sample
	WHERE smp_id % ( SELECT ( COUNT(smp_id) / $1 ) FROM sample ) = 0 
	ORDER BY smp_time DESC`
	p := []interface{}{n}
	return job_data.GetSamples(q, p)
}
func (job_data *JobData) GetSamples_Preview() (err error) { /* RETURNS ~ 10,000 SAMPLES */
	q := `SELECT DISTINCT * FROM sample
	WHERE 
	( 
		( SELECT COUNT(smp_id) FROM sample ) > 10000 
		AND 
		smp_id % ( SELECT ( COUNT(smp_id) / 10000 )  FROM sample ) = 0 
	)
	OR
	( SELECT COUNT(smp_id) FROM sample ) < 10000 
	ORDER BY smp_time DESC`
	p := []interface{}{}
	return job_data.GetSamples(q, p)
}
func (job_data *JobData) GetLastSample() (err error) {
	q := `SELECT DISTINCT * FROM sample 
	WHERE smp_time = ( 
		SELECT MAX( smp_time ) FROM sample 
	) 
	ORDER BY smp_time DESC`
	p := []interface{}{}
	return job_data.GetSamples(q, p)
}
