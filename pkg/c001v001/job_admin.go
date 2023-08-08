package c001v001

/* SQLITE - DEVELOPMENT - JOB DATABASE - CONFIG TABLE */
const CREATE_ADMIN_TABLE string = `CREATE TABLE admin (
    adm_id BIGSERIAL PRIMARY KEY,

	adm_time BIGINT NOT NULL,
    adm_addr TEXT,
    adm_user_id BIGINT NOT NULL,
    adm_app TEXT NOT NULL,

    adm_def_host TEXT NOT NULL,
    adm_def_port BIGINT NOT NULL,
    adm_op_host TEXT NOT NULL,
    adm_op_port BIGINT NOT NULL,

    adm_class TEXT NOT NULL,
    adm_version TEXT NOT NULL,
    adm_serial TEXT NOT NULL,

    adm_bat_hi_amp REAL NOT NULL,
    adm_bat_lo_volt REAL NOT NULL,
	
    adm_mot_hi_amp REAL NOT NULL,
	
    adm_hfs_flow REAL NOT NULL,
    adm_hfs_flow_min REAL NOT NULL,
    adm_hfs_flow_max REAL NOT NULL,
    adm_hfs_press REAL NOT NULL,
    adm_hfs_press_min REAL NOT NULL,
    adm_hfs_press_max REAL NOT NULL,
    adm_hfs_diff REAL NOT NULL,
    adm_hfs_diff_min REAL NOT NULL,
    adm_hfs_diff_max REAL NOT NULL,
	
    adm_lfs_flow REAL NOT NULL,
    adm_lfs_flow_min REAL NOT NULL,
    adm_lfs_flow_max REAL NOT NULL,
    adm_lfs_press REAL NOT NULL,
    adm_lfs_press_min REAL NOT NULL,
    adm_lfs_press_max REAL NOT NULL,
    adm_lfs_diff REAL NOT NULL,
    adm_lfs_diff_min REAL NOT NULL,
    adm_lfs_diff_max REAL NOT NULL
);`

/*
ADMIN - AS WRITTEN TO JOB DATABASE
*/
type AdminJDB struct {
	AdmID int64 `json:"adm_id"`
	MQTTAdmin
}

func (adm *AdminJDB) WriteAdmin(job *Job) (err error) {
	q := `INSERT INTO admin (
		adm_time,
		adm_addr,
		adm_user_id,
		adm_app,
	
		adm_def_host,
		adm_def_port,
		adm_op_host,
		adm_op_port,
	
		adm_class,
		adm_version,
		adm_serial,
	
		adm_bat_hi_amp,
		adm_bat_lo_volt,
		
		adm_mot_hi_amp,
		
		adm_hfs_flow,
		adm_hfs_flow_min,
		adm_hfs_flow_max,
		adm_hfs_press,
		adm_hfs_press_min,
		adm_hfs_press_max,
		adm_hfs_diff,
		adm_hfs_diff_min,
		adm_hfs_diff_max,
		
		adm_lfs_flow,
		adm_lfs_flow_min,
		adm_lfs_flow_max,
		adm_lfs_press,
		adm_lfs_press_min,
		adm_lfs_press_max,
		adm_lfs_diff,
		adm_lfs_diff_min,
		adm_lfs_diff_max
	)
	VALUES ( 
		$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 
		$17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32 
	);`

	p := []interface{}{
		adm.AdmTime,
		adm.AdmAddr,
		adm.AdmUserID,
		adm.AdmApp,

		adm.AdmDefHost,
		adm.AdmDefPort,
		adm.AdmOpHost,
		adm.AdmOpsPort,

		adm.AdmClass,
		adm.AdmVersion,

		adm.AdmSerial,

		adm.AdmBatHiAmp,
		adm.AdmBatLoVolt,
		adm.AdmMotHiAmp,

		adm.AdmHFSFlow,
		adm.AdmHFSFlowMin,
		adm.AdmHFSFlowMax,
		adm.AdmHFSPress,
		adm.AdmHFSPressMin,
		adm.AdmHFSPressMax,
		adm.AdmHFSDiff,
		adm.AdmHFSDiffMin,
		adm.AdmHFSDiffMax,

		adm.AdmLFSFlow,
		adm.AdmLFSFlowMin,
		adm.AdmLFSFlowMax,
		adm.AdmLFSPress,
		adm.AdmLFSPressMin,
		adm.AdmLFSPressMax,
		adm.AdmLFSDiff,
		adm.AdmLFSDiffMin,
		adm.AdmLFSDiffMax,
	}
	return job.JDB().Execute(q, p)
}

/*Get one Admin*/
func (adm *AdminJDB) GetAdmin(job *Job, qry string, params []interface{}) (err error) {

	rows, err := job.JDB().Select(qry, params)
	if err != nil {
		return err
	}
	defer rows.Close()

	rows.Next()
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
		return err
	} // pkg.Json("(admin *AdminJDB) GetAdmin -> admin:", admin)

	return err
}
func (admin *AdminJDB) GetAdminByID(job *Job, id int64) (err error) {
	q := `SELECT DISTINCT * FROM admin WHERE adm_id = $1 ORDER BY adm_time DESC`
	p := []interface{}{id}
	return admin.GetAdmin(job, q, p)
}
func (admin *AdminJDB) GetAdminByTime(job *Job, t int64) (err error) {
	q := `SELECT DISTINCT * FROM admin WHERE adm_time = $1 ORDER BY adm_id DESC`
	p := []interface{}{t}
	return admin.GetAdmin(job, q, p)
}
