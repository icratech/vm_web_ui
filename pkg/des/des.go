package des

/*
USED WHEN:
 - DATACAN ADMIN WEB CLIENTS REGISTER NEW DEVICES ON THIS DES
 - WEB CLIENTS REQUEST ACCESS TO DEVICES/JOBS REGISTERED ON THIS DES

CLASS & VERSION AGNOSTIC
*/
type DESRegistration struct {
	DESDevice //`json:"des_device"`
	DESJob    //`json:"des_job"`
}

func (desr * DESRegistration) GetDESRegistrations(qry string, params []interface{}) (regs []DESRegistration, err error) {
	rows, err := DB.Select(qry, params)
	if err != nil {
		return regs, err
	}
	defer rows.Close()

	for rows.Next() {
		des_reg := DESRegistration{}
		err = rows.Scan(

			/* DESDevice */
			&des_reg.DESDevID,

			&des_reg.DESDevRegTime,
			&des_reg.DESDevRegAddr,
			&des_reg.DESDevRegUesrID,
			&des_reg.DESDevRegApp,
	
			&des_reg.DESDevSerial,
			&des_reg.DESDevVersion,
			&des_reg.DESDevClass,

			/* DESJob */
			&des_reg.DESJobID,

			&des_reg.DESJobRegTime,
			&des_reg.DESJobRegAddr,
			&des_reg.DESJobRegUesrID,
			&des_reg.DESJobRegApp, 
			
			&des_reg.DESJobName, 
			&des_reg.DESJobStart, 
			&des_reg.DESJobEnd,
			&des_reg.DESJobDevID, 

		)
		regs = append(regs, des_reg)
	}
	return regs, err
}

func (desr *DESRegistration) GetActiveDevices() (devices []DESRegistration, err error) {
	q := `SELECT DISTINCT d.*, j.*

	FROM des_device AS d

	JOIN des_job AS j ON d.dev_id = j.job_device_id
	
	GROUP BY (
		 d.dev_id, 
		 d.dev_serial, 
		 j.job_id 
	)

	ORDER BY d.dev_reg_time DESC`
	p := []interface{}{}
	return desr.GetDESRegistrations(q, p)
}

func (desr *DESRegistration) GetDESJobs_All() (jobs []DESRegistration, err error) {
	q := `SELECT DISTINCT d.*, j.*
	FROM des_device AS d
	JOIN des_job AS j ON d.dev_id = j.job_device_id
	
	GROUP BY (
		 d.dev_id, 
		 d.dev_serial, 
		 j.job_id 
	)

	ORDER BY j.job_reg_time DESC
	`
	p := []interface{}{}
	return desr.GetDESRegistrations(q, p)
}

type XYPoint struct {
	X int64   `json:"x"`
	Y float32 `json:"y"`
}

