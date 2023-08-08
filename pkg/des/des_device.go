package des

import (
	"github.com/leehayford/go-sveltekit/pkg"
)

const SQLITE_CREATE_DES_DEVICE_TABLE string = `CREATE TABLE IF NOT EXISTS des_device (
    dev_id INTEGER PRIMARY KEY AUTOINCREMENT,
    	
    dev_reg_time INTEGER NOT NULL,
    dev_reg_addr TEXT,
    dev_reg_user_id INTEGER NOT NULL,
    dev_reg_app TEXT NOT NULL,
	
    dev_serial TEXT (10) NOT NULL,
    dev_version	TEXT (3) NOT NULL,
	dev_class TEXT (3) NOT NULL
);`
const PG_CREATE_DES_DEVICE_TABLE string = `CREATE TABLE IF NOT EXISTS des_device (
    dev_id BIGSERIAL PRIMARY KEY,
    	
    dev_reg_time BIGINT NOT NULL,
    dev_reg_addr TEXT,
    dev_reg_user_id BIGINT NOT NULL,
    dev_reg_app TEXT NOT NULL,
	
    dev_serial VARCHAR(10) NOT NULL,
    dev_version	VARCHAR(3) NOT NULL,
	dev_class VARCHAR(3) NOT NULL
);`

type DESDevice struct {
	DESDevID int64 `json:"des_dev_id"`

	DESDevRegTime   int64  `json:"des_dev_reg_time"`
	DESDevRegAddr   string `json:"des_dev_reg_addr"`
	DESDevRegUesrID int64  `json:"des_dev_reg_user_id"`
	DESDevRegApp    string `json:"des_dev_reg_app"`

	DESDevSerial  string `json:"des_dev_serial"`
	DESDevVersion string `json:"des_dev_version"`
	DESDevClass   string `json:"des_dev_class"`
}

func (desd *DESDevice) WriteDESDevice() (err error) {
	q := `INSERT INTO des_device 
	( 
		dev_reg_time, 
		dev_reg_addr,
		dev_reg_user_id,
		dev_reg_app,

		dev_serial,
		dev_version,
		dev_class
	) 
	VALUES ( $1, $2, $3, $4, $5, $6, $7 )`
	p := []interface{}{
		&desd.DESDevRegTime,
		&desd.DESDevRegAddr,
		&desd.DESDevRegUesrID,
		&desd.DESDevRegApp,

		&desd.DESDevSerial,
		&desd.DESDevVersion,
		&desd.DESDevClass,
	}
	return DB.Execute(q, p)
}

func (desj *DESDevice) RegisterDESDevice() (err error) {

	/* Creaet a new des_device record in the DES database */
	if err = desj.WriteDESDevice(); err != nil {
		return err
	}

	/* Get the DESDevID*/
	if err = desj.GetDESDeviceBySerial(desj.DESDevSerial); err != nil {
		return err
	} // pkg.Json("des.RegisterDESDevice() -> desdb.GetDeviceBySerial() -> desd:", desd)

	return err
}

/* Get a Device */
func (desd *DESDevice) GetDESDevice(qry string, params []interface{}) (err error) {

	// fmt.Printf("\nGetDESDevice(...)\n")
	rows, err := DB.Select(qry, params)
	if err != nil {
		return err
	}
	defer rows.Close()

	rows.Next()
	err = rows.Scan(
		&desd.DESDevID,

		&desd.DESDevRegTime,
		&desd.DESDevRegAddr,
		&desd.DESDevRegUesrID,
		&desd.DESDevRegApp,

		&desd.DESDevSerial,
		&desd.DESDevVersion,
		&desd.DESDevClass,
	)
	if err != nil {
		return err
	} // pkg.Json("(desd *DESDevice) GetDESDevice -> desd:", desd)

	return err
}
func (desd *DESDevice) GetDESDeviceByID(id int64) (err error) {
	q := `SELECT DISTINCT * FROM des_device 
	WHERE dev_id = $1 
	ORDER BY dev_reg_time DESC`
	p := []interface{}{id}
	return desd.GetDESDevice(q, p)
}
func (desd *DESDevice) GetDESDeviceBySerial(serial string) (err error) {
	q := `SELECT DISTINCT * FROM des_device 
	WHERE dev_serial LIKE $1 
	ORDER BY dev_reg_time DESC`
	p := []interface{}{serial}
	return desd.GetDESDevice(q, p)
}

/* Get many Devices */
func (desd *DESDevice) GetDESDevices(qry string, params []interface{}) (desds []DESDevice, err error) {

	rows, err := DB.Select(qry, params)
	if err != nil {
		return desds, err
	}
	defer rows.Close()

	for rows.Next() {
		desd := DESDevice{}
		err = rows.Scan(
			&desd.DESDevID,

			&desd.DESDevRegTime,
			&desd.DESDevRegAddr,
			&desd.DESDevRegUesrID,
			&desd.DESDevRegApp,

			&desd.DESDevSerial,
			&desd.DESDevVersion,
			&desd.DESDevClass,
		)
		if err != nil {
			pkg.Trace(err)
		}
		desds = append(desds, desd)
	}

	return desds, err
}
func (desd *DESDevice) GetDESDevices_All() (desds []DESDevice, err error) {
	q := `SELECT DISTINCT * FROM des_device 
	ORDER BY dev_reg_time DESC`
	p := []interface{}{}
	return desd.GetDESDevices(q, p)
}
func (desd *DESDevice) GetDESDevicesByClassVersion(class, version string) (desds []DESDevice, err error) {
	q := `SELECT DISTINCT * FROM des_device 
	WHERE dev_class LIKE $1
	AND dev_version LIKE $2
	AND dev_serial NOT LIKE ''
	ORDER BY dev_serial DESC`
	p := []interface{}{class, version}
	return desd.GetDESDevices(q, p)
}

/* Get all jobs for a device  */
func (desd *DESDevice) GetDESDeviceJobs() (desjs []DESJob, err error) {
	return (&DESJob{}).GetDESJobsByDeviceID(desd.DESDevID)
}
