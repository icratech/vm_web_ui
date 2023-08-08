package des

import (
	"fmt"
	"strings"

	"github.com/leehayford/go-sveltekit/pkg"
)

const SQLITE_CREATE_DES_JOB_TABLE string = `CREATE TABLE IF NOT EXISTS des_job (
    job_id INTEGER PRIMARY KEY AUTOINCREMENT,
    	
    job_reg_time INTEGER NOT NULL,
    job_reg_addr TEXT,
    job_reg_user_id INTEGER NOT NULL,
    job_reg_app TEXT NOT NULL,
	
    job_name TEXT (27) UNIQUE NOT NULL,
    job_start INTEGER NOT NULL,
    job_end INTEGER NOT NULL,
	job_device_id INTEGER REFERENCES des_device (dev_id)
);`

const PG_CREATE_DES_JOB_TABLE string = `CREATE TABLE IF NOT EXISTS des_job (
    job_id  BIGSERIAL PRIMARY KEY,

    job_reg_time BIGINT NOT NULL,
    job_reg_addr TEXT,
    job_reg_user_id BIGINT NOT NULL,
    job_reg_app TEXT NOT NULL,
	
    job_name VARCHAR(27) UNIQUE NOT NULL,
    job_start BIGINT NOT NULL,
    job_end BIGINT NOT NULL,
	job_device_id BIGINT REFERENCES des_device (dev_id)
);`

type DESJob struct {
	DESJobID int64 `json:"des_job_id"`

	DESJobRegTime   int64  `json:"des_job_reg_time"`
	DESJobRegAddr   string `json:"des_job_reg_addr"`
	DESJobRegUesrID int64  `json:"des_job_reg_user_id"`
	DESJobRegApp    string `json:"des_job_reg_app"`

	DESJobName  string `json:"des_job_name"`
	DESJobStart int64  `json:"des_job_start"`
	DESJobEnd   int64  `json:"des_job_end"`
	DESJobDevID int64  `json:"des_job_dev_id"`
}

func (desj *DESJob) WriteDESJob() (err error) {
	q := `INSERT INTO des_job 
	( 
		job_reg_time, 
		job_reg_addr,
		job_reg_user_id,
		job_reg_app,
		
		job_name, 
		job_start, 
		job_end,
		job_device_id 
	) 
	VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 )`
	p := []interface{}{
		&desj.DESJobRegTime,
		&desj.DESJobRegAddr,
		&desj.DESJobRegUesrID,
		&desj.DESJobRegApp,

		&desj.DESJobName,
		&desj.DESJobStart,
		&desj.DESJobEnd,
		&desj.DESJobDevID,
	}
	return DB.Execute(q, p)
}
func (desj *DESJob) RegisterDESJob() (err error) {

	/* Creaet a new des_job record in the DES database */
	if err = desj.WriteDESJob(); err != nil {
		return err
	} // pkg.Json(fmt.Sprintf(`(desj *DESJob) RegisterDESJob() -> desj.GetActiveJobForDevice( %d ) -> desj :`, desd_id), desj)

	if err = desj.GetDESJobActiveOnDevice(desj.DESJobDevID); err != nil {
		return err
	} // pkg.Json(fmt.Sprintf(`(desj *DESJob) RegisterDESJob() -> desj.GetActiveJobForDevice( %d ) -> desj:`, desd_id), desj)

	return err
}
func (desj *DESJob) JDB() *DBI {
	return &DBI{
		Driver:  pkg.DES_DB_DRIVER,
		ConnStr: fmt.Sprintf("%s%s", pkg.DB_SERVER_CONNECTION_STRING, strings.ToLower(desj.DESJobName)),
	}
}

/*Get one Job*/
func (desj *DESJob) GetDESJob(qry string, params []interface{}) (err error) {

	rows, err := DB.Select(qry, params)
	if err != nil {
		return err
	}
	defer rows.Close()

	rows.Next()
	err = rows.Scan(
		&desj.DESJobID,

		&desj.DESJobRegTime,
		&desj.DESJobRegAddr,
		&desj.DESJobRegUesrID,
		&desj.DESJobRegApp,

		&desj.DESJobName,
		&desj.DESJobStart,
		&desj.DESJobEnd,
		&desj.DESJobDevID,
	)
	if err != nil {
		return err
	} // pkg.Json("(desj *DESJob) GetJob( ) -> desj:", desj)

	return err
}
func (desj *DESJob) GetDESJobByName(name string) (err error) {
	q := `SELECT DISTINCT * FROM des_job 
	WHERE job_name LIKE $1 
	ORDER BY job_reg_time DESC`
	p := []interface{}{name}
	return desj.GetDESJob(q, p)
}
func (desj *DESJob) GetDESJobByID(id int64) (err error) {
	q := `SELECT DISTINCT * FROM des_job 
	WHERE job_id = $1 
	ORDER BY job_reg_time DESC`
	p := []interface{}{id}
	return desj.GetDESJob(q, p)
}
func (desj *DESJob) GetDESJobActiveOnDevice(desd_id int64) (err error) {
	q := `SELECT DISTINCT * FROM des_job 
	WHERE job_device_id = $1 
	AND job_end = 0 
	ORDER BY job_reg_time DESC`
	p := []interface{}{desd_id}
	return desj.GetDESJob(q, p)
}

/*Get many Jobs*/
func (desj *DESJob) GetDESJobs(qry string, params []interface{}) (desjs []DESJob, err error) {

	rows, err := DB.Select(qry, params)
	if err != nil {
		return desjs, err
	}
	defer rows.Close()

	for rows.Next() {
		desj := DESJob{}
		err = rows.Scan(
			&desj.DESJobID,

			&desj.DESJobRegTime,
			&desj.DESJobRegAddr,
			&desj.DESJobRegUesrID,
			&desj.DESJobRegApp,

			&desj.DESJobName,
			&desj.DESJobStart,
			&desj.DESJobEnd,
			&desj.DESJobDevID,
		)
		if err != nil {
			return desjs, err
		}
		desjs = append(desjs, desj)
	}

	return desjs, err
}
func (desj *DESJob) GetDESJobs_All() (desjs []DESJob, err error) {
	q := `SELECT DISTINCT * FROM des_job
	ORDER BY job_reg_time DESC`
	p := []interface{}{}
	return desj.GetDESJobs(q, p)
}

/* Get all jobs for a device  */
func (desj *DESJob) GetDESJobsByDeviceID(id int64) (desjs []DESJob, err error) {
	q := `SELECT DISTINCT * FROM des_job 
	WHERE job_device_id = $1 
	ORDER BY job_reg_time DESC`
	p := []interface{}{id}
	return desj.GetDESJobs(q, p)
}

/* Get the device for a job  */
func (desj *DESJob) GetDESJobDevice() (desd *DESDevice, err error) {
	err = (desd).GetDESDeviceByID(desj.DESJobDevID)
	return desd, err
}
