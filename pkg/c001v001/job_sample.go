package c001v001

import (
	"github.com/leehayford/go-sveltekit/pkg"
)

/* SQLITE - DEVELOPMENT - JOB DATABASE - SAMPLE TABLE */
const CREATE_SAMPLES_TABLE string = `CREATE TABLE sample (
    smp_id BIGSERIAL PRIMARY KEY,
    smp_time BIGINT NOT NULL UNIQUE,
    smp_ch4 REAL,
    smp_hi_flow REAL,
    smp_lo_flow REAL,
    smp_press REAL,
    smp_bat_amp REAL,
    smp_bat_volt REAL,
    smp_mot_volt REAL,
    smp_vlv_tgt BIGINT,
    smp_vlv_pos BIGINT,
	smp_job_name VARCHAR(27)
);`

/* SAMPLE - AS WRITTEN TO JOB DATABASE */
type Sample struct {
	SmpID      int64   `json:"smp_id"`
	SmpTime    int64   `json:"smp_time"`
	SmpCH4     float32 `json:"smp_ch4"`
	SmpHiFlow  float32 `json:"smp_hi_flow"`
	SmpLoFlow  float32 `json:"smp_lo_flow"`
	SmpPress   float32 `json:"smp_press"`
	SmpBatAmp  float32 `json:"smp_bat_amp"`
	SmpBatVolt float32 `json:"smp_bat_volt"`
	SmpMotVolt float32 `json:"smp_mot_volt"`
	SmpVlvTgt  uint32  `json:"smp_vlv_tgt"`
	SmpVlvPos  uint32  `json:"smp_vlv_pos"`
	SmpJobName string  `json:"smp_job_name"`
}

func (smp *Sample) WriteSample(job *Job) (err error) {
	q := `INSERT INTO sample 
	( 
		smp_time, 
		smp_ch4, 
		smp_hi_flow, 
		smp_lo_flow, 
		smp_press, 
		smp_bat_amp, 
		smp_bat_volt, 
		smp_mot_volt,
		smp_vlv_tgt,
		smp_vlv_pos,
		smp_job_name
	)
	VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 );`
	p := []interface{}{
		smp.SmpTime,    // 1
		smp.SmpCH4,     // 2
		smp.SmpHiFlow,  // 3
		smp.SmpLoFlow,  // 4
		smp.SmpPress,   // 5
		smp.SmpBatAmp,  // 6
		smp.SmpBatVolt, // 7
		smp.SmpMotVolt, // 8
		smp.SmpVlvTgt,  // 9
		smp.SmpVlvPos,  // 10
		smp.SmpJobName, // 11
	}

	return job.JDB().Execute(q, p)
}

/*GET ONE SAMPLE*/
func (smp *Sample) GetSample(job *Job, qry string, params []interface{}) (err error) {

	rows, err := job.JDB().Select(qry, params)
	if err != nil {
		return pkg.Trace(err)
	}
	defer rows.Close()

	rows.Next()
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

	return err
}

// /* SAMPLE - TESTS */
// func Sample_Test_DecodeMQTTSampleMessage() bool {

// 	/* SEED DATA */
// 	ms := MQTTSampleMessage{
// 		JobID: "VMDEMO0000-1688655646185033",
// 		Data: []string{
// 			"AAABgss3qZhCxM2nOyPXCj5u96s/DP30PstWMkFGw+1BQWVuAAYABg==", // Time: 1661266799000 ...
// 			"AAABgss3rYBCxs2nO2VgQj6qrwk/JpeNPv6JZUFWw+1BUWVuAAQABA==", // Time: 1661266800000 ...
// 		},
// 	}
// 	/* SEED DATA - AS RECEIVED VIA MQTT */
// 	js, js_err := json.Marshal(ms)
// 	if js_err != nil {
// 		pkg.Trace(js_err)
// 	}

// 	/* EXPECTED TSDBSample.InsertQry() OUTPUT */
// 	q := []string{
// 		fmt.Sprintf("INSERT INTO %s VALUES (  1661266799000,  98.401665,  0.002500,  0.233367,  0.550750,  0.397142,  12.422833,  12.087263,  6,  6  );", ms.JobID),
// 		fmt.Sprintf("INSERT INTO %s VALUES (  1661266800000,  99.401665,  0.003500,  0.333367,  0.650750,  0.497142,  13.422833,  13.087263,  4,  4  );", ms.JobID),
// 	}
// 	ok := true
// 	tss := DecodeMQTTSampleMessage(js)
// 	for i, v := range tss {
// 		ok = v.InsertQry() == q[i]
// 		fmt.Printf("\nDecode sample %d OK:\t%v\n", i, ok)
// 	}
// 	fmt.Println()
// 	return ok
// }
