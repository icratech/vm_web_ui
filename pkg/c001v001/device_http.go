package c001v001

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"time"

	"github.com/leehayford/go-sveltekit/pkg"
	"github.com/leehayford/go-sveltekit/pkg/des"
)

func RegisterDeviceRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/001/001/register_device", Handle_RegisterDevice)
	mux.HandleFunc("/001/001/devices", Handle_GetDevices)
	mux.HandleFunc("/001/001/live_job", Handle_ConnectDeviceUser)
}

func Handle_RegisterDevice(w http.ResponseWriter, r *http.Request) {
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

			now := time.Now().UTC().UnixMicro()

			des_reg := &des.DESRegistration{}
			if err = json.Unmarshal(body, &des_reg); err != nil {
				pkg.HTTPErr(&w, err)
			} 
			pkg.Json("HandleRegister_Device(...) -> des.des.DESRegistration:", des_reg)
			des_reg.DESDevRegAddr = r.RemoteAddr
			des_reg.DESDevRegTime = now
			/* TODO: LOG REQUEST */

			if err = (&Device{}).RegisterDevice(des_reg); err != nil {
				pkg.HTTPErr(&w, err)
			} 
			pkg.Json(`HandleRegister_Device(...) ->  (&Device{}).RegisterDevice(...)
			des.DESRegistration:`, 
			des_reg)

			js, err := json.Marshal(des_reg)
			if err != nil {
				pkg.HTTPErr(&w, err)
			}

    		w.WriteHeader(http.StatusOK)
			w.Write(js)
		}
	}
}

func Handle_GetDevices(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	/*TODO:  HANDLE PERMISSIONS ETC. */
	accessOK := true
	if accessOK {
		if r.Method == "GET" {

			drs, err := (&des.DESRegistration{}).GetActiveDevices()
			if err != nil {
				pkg.HTTPErr(&w, err)
			}

			js, err := json.Marshal(drs)
			if err != nil {
				pkg.HTTPErr(&w, err)
			}

			w.WriteHeader(http.StatusOK)
			w.Write(js)
		}
	}
}

func Handle_ConnectDeviceUser(w http.ResponseWriter, r *http.Request) {
	des_regStr, _ := url.QueryUnescape(r.URL.Query().Get("des_reg"))
	fmt.Printf("\nHandle_ConnectDeviceUser(...) -> des_regStr: %s\n\n", des_regStr)

	/*TODO:  HANDLE PERMISSIONS ETC. */
	accessOK := true
	if accessOK {

		des_reg := des.DESRegistration{}
		if err := json.Unmarshal([]byte(des_regStr), &des_reg); err != nil {
			pkg.HTTPReqErr(&w, err)
		}
		des_reg.DESDevRegAddr = r.RemoteAddr
		des_reg.DESJobRegAddr = r.RemoteAddr
		// pkg.Json("Handle_ConnectDeviceUser(...) -> des.DESRegistration:", des_reg)

		// confirm Device
		// confirm Active Job
		ssecid := fmt.Sprintf("%s-%d-%s",
			r.RemoteAddr,
			des_reg.DESDevRegUesrID,
			des_reg.DESJobName,
		) // fmt.Printf("\nHandle_ConnectDeviceUser(...) -> ssecid: %s\n\n", ssecid)

		duc := &DeviceUserClient{
			Device:      Device{
				DESDevice: des_reg.DESDevice,
				Job:         Job{
					DESJob: des_reg.DESJob,
				},
			},
			SSEClientID: ssecid,
		} // fmt.Printf("\nHandle_ConnectDeviceUser(...) -> duc: %v\n\n", duc)
		duc.SSEDeviceUserClient_Connect(w, r)
	}
}
