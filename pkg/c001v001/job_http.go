package c001v001

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/leehayford/go-sveltekit/pkg"
	"github.com/leehayford/go-sveltekit/pkg/des"
)

func RegisterJobRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/001/001/jobs", Handle_GetJobs)
	mux.HandleFunc("/001/001/job_data", Handle_GetJobData)
	// mux.HandleFunc("/001/001/job_stats", Handle_GetJobStats)
}

func Handle_GetJobs(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	/*TODO:  HANDLE PERMISSIONS ETC. */
	accessOK := true
	if accessOK {
		if r.Method == "GET" {

			des_regs, err := (&des.DESRegistration{}).GetDESJobs_All()
			if err != nil {
				pkg.HTTPErr(&w, err)
			} // pkg.Json("\nHandle_GetJobs(...) -> (&des.DESRegistration{}).GetDESJobs_All(  ):\n%s\n\n", des_regs)
		
		
			jobs := []*JobData{}
			for _, des_reg := range des_regs {
				job_data := &JobData{ DESRegistration: des_reg }
				job_data.GetJobStats()
				jobs = append(jobs, job_data)
			} // pkg.Json("\nHandle_GetJobs(...) -> job_data.GetJobStats():\n%s\n\n", jobs)
		

			js, err := json.Marshal(jobs)
			if err != nil {
				pkg.HTTPErr(&w, err)
			}
			
    		w.WriteHeader(http.StatusOK)
			w.Write(js)
		}
	}
}

func Handle_GetJobData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	/*TODO:  HANDLE PERMISSIONS ETC. */
	accessOK := true
	if accessOK {
		if r.Method == "POST" {

			body, err := ioutil.ReadAll(r.Body)
			if err != nil {
				pkg.HTTPReqErr(&w, err)
			}
			defer r.Body.Close()

			des_reg := des.DESRegistration{}
			if err = json.Unmarshal(body, &des_reg); err != nil {
				pkg.HTTPReqErr(&w, err)
			} 
			pkg.Json("Handle_GetJobData(...) -> des.des.DESRegistration:", des_reg)

			job_data := &JobData{ DESRegistration: des_reg, }
			if err := job_data.GetJobData(); err != nil {
				pkg.HTTPErr(&w, err)
			}

			js, err := json.Marshal(job_data)
			if err != nil {
				pkg.HTTPErr(&w, err)
			}

    		w.WriteHeader(http.StatusOK)
			w.Write(js)
		}
	}
}


// func Handle_GetJobStats(w http.ResponseWriter, r *http.Request) {
// 	fmt.Printf("\nHandle_GetJobStats(...)\n")

// 	/*TODO:  HANDLE PERMISSIONS ETC. */
// 	accessOK := true
// 	if accessOK {
// 		if r.Method == "POST" {

// 			body, err := ioutil.ReadAll(r.Body)
// 			if err != nil {
// 				pkg.Trace(err)
// 			}
// 			defer r.Body.Close()

// 			des_reg := &des.DESRegistration{}
// 			if err = json.Unmarshal(body, &des_reg); err != nil {
// 				pkg.Trace(err)
// 				/*TODO: PROPER HTTP STATUS ETC */
// 				w.Write([]byte("REGISTRATION FAILED - BAD REGISTRATION DAT IN REQUEST"))
// 			} // pkg.Json("nHandle_GetJobStats(...) -> des.des.DESRegistration:", des_reg)

// 			/* TODO: LOG REQUEST */

// 			jobstats := &JobStats{
// 				DESJob:    des_reg.DESJob,
// 				DESDevice: des_reg.DESDevice,
// 			}
// 			pkg.Json("nHandle_GetJobStats(...) -> jobstats:", jobstats)
// 			jobstats.GetJobStats()

// 			js, err := json.Marshal(jobstats)
// 			if err != nil {
// 				/*TODO: PROPER HTTP STATUS ETC */
// 				pkg.Trace(err)
// 				w.Write([]byte("GET JOB STATS FAILED"))
// 			}

// 			/*TODO: PROPER HTTP STATUS ETC */
// 			w.Write(js)
// 		}
// 	}
// }

