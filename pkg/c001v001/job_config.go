package c001v001

/* SQLITE - DEVELOPMENT - JOB DATABASE - CONFIG TABLE */
const CREATE_CONFIG_TABLE string = `CREATE TABLE config (
    cfg_id BIGSERIAL PRIMARY KEY,

	cfg_time BIGINT NOT NULL,
    cfg_addr TEXT,
    cfg_user_id BIGINT NOT NULL,
    cfg_app TEXT NOT NULL,

	cfg_job_name TEXT NOT NULL,
    cfg_job_start BIGINT NOT NULL,
    cfg_job_end BIGINT NOT NULL,
    cfg_scvd REAL NOT NULL,
    cfg_scvd_mult REAL NOT NULL,
    cfg_ssp_rate REAL NOT NULL,
    cfg_ssp_dur REAL NOT NULL,
    cfg_hi_scvf REAL NOT NULL,
    cfg_flow_tog REAL NOT NULL,

    cfg_vlv_tgt BIGINT NOT NULL,
    cfg_vlv_pos BIGINT NOT NULL,
	
    cfg_op_sample BIGINT NOT NULL,
    cfg_op_log BIGINT NOT NULL,
    cfg_op_trans BIGINT NOT NULL,
	
    cfg_diag_sample BIGINT NOT NULL,
    cfg_diag_log BIGINT NOT NULL,
    cfg_diag_trans BIGINT NOT NULL
);`

/*
CONFIG - AS WRITTEN TO JOB DATABASE
*/
type ConfigJDB struct {
	CfgID int64 `json:"cfg_id"`
	MQTTConfig
}

func (cfg *ConfigJDB) WriteConfig(job *Job) (err error) {
	q := `INSERT INTO config (
		cfg_time,
		cfg_addr,
		cfg_user_id,
		cfg_app,
	
		cfg_job_name,
		cfg_job_start,
		cfg_job_end,
		cfg_scvd,
		cfg_scvd_mult,
		cfg_ssp_rate,
		cfg_ssp_dur,
		cfg_hi_scvf,
		cfg_flow_tog,
	
		cfg_vlv_tgt,
		cfg_vlv_pos,
		
		cfg_op_sample,
		cfg_op_log,
		cfg_op_trans,
		
		cfg_diag_sample,
		cfg_diag_log,
		cfg_diag_trans
	)
	VALUES ( 
		$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 
		$12, $13, $14, $15, $16, $17, $18, $19, $20, $21 
	);`
	p := []interface{}{
		cfg.CfgTime,
		cfg.CfgAddr,
		cfg.CfgUserID,
		cfg.CfgApp,

		cfg.CfgJobName,
		cfg.CfgJobStart,
		cfg.CfgJobEnd,
		cfg.CfgSCVD,
		cfg.CfgSCVDMult,
		cfg.CfgSSPRate,
		cfg.CfgSSPDur,
		cfg.CfgHiSCVF,
		cfg.CfgFlowTog,

		cfg.CfgVlvTgt,
		cfg.CfgVlvPos,

		cfg.CfgOpSample,
		cfg.CfgOpLog,
		cfg.CfgOpTrans,

		cfg.CfgDiagSample,
		cfg.CfgDiagLog,
		cfg.CfgDiagTrans,
	}
	return job.JDB().Execute(q, p)
}

/*Get one Config*/
func (cfg *ConfigJDB) GetConfig(job *Job, qry string, params []interface{}) (err error) {

	rows, err := job.JDB().Select(qry, params)
	if err != nil {
		return err
	}
	defer rows.Close()

	rows.Next()
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
		return err
	} // pkg.Json("(config *ConfigJDB) GetConfig( ) -> config:", config)

	return err
}
func (config *ConfigJDB) GetConfigByID(job *Job, id int64) (err error) {
	q := `SELECT DISTINCT * FROM config WHERE cfg_id = $1 ORDER BY cfg_time DESC`
	p := []interface{}{id}
	return config.GetConfig(job, q, p)
}
func (config *ConfigJDB) GetConfigByTime(job *Job, t int64) (err error) {
	q := `SELECT DISTINCT * FROM config WHERE cfg_time = $1 ORDER BY cfg_id DESC`
	p := []interface{}{t}
	return config.GetConfig(job, q, p)
}
