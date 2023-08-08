package demo

import (
	"context"
	"encoding/csv"
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
	"mime/multipart"
	"os"

	"strings"
	"time"

	"github.com/leehayford/go-sveltekit/pkg"
	// "github.com/leehayford/go-sveltekit/pkg/des"
	cv "github.com/leehayford/go-sveltekit/pkg/c001v001"
)

// var VMDemoSerial = "DEMO001001"

// var Demo_LocalCSV_Path_Home string = "D:\\Datacan Stuff\\VentMedic\\16-16-077-17W6-complete.csv"
var Demo_LocalCSV_Path_Home string = "D:\\Datacan Stuff\\VentMedic\\100_13-26-049-15W4_00-complete.csv"

// var Demo_LocalCSV_Path_Work string = "C:\\Projects\\VentMEDIC\\Software\\VMDemo\\data\\16-16-077-17W6-complete.csv"
var Demo_LocalCSV_Path_Work string = "C:\\Projects\\VentMEDIC\\Software\\VMDemo\\data\\100_13-26-049-15W4_00-complete.csv"
var Demo_LocalCSV_Path string = Demo_LocalCSV_Path_Home

type Demo_CSVLineSample struct {
	Time int64
	CH4  float32
	HF   float32
	LF   float32
	P    float32
	BC   float32
	BV   float32
	MV   float32
	VT   float32
	VP   float32
}

func Demo_ConvertCSVTime(dtStr string) (time.Time, error) {
	dt := strings.Replace(dtStr, "/", "T", -1) // fmt.Printf("\n\tDateTime to parse:\t%s\n", dt)
	stamp, err := time.Parse(time.RFC3339, dt)
	if err != nil {
		fmt.Printf("\n\tdtStr :\t%s\n", dtStr)
		pkg.Trace(err)
	}
	// fmt.Printf("\n\tUnix:\t%d\n", stamp.Unix())
	// fmt.Printf("\n\tUnixMilli:\t%d\n", stamp.UnixMilli())
	// fmt.Printf("\n\tUnixMicro:\t%d\n", stamp.UnixMicro())
	return stamp, nil
}
func Demo_MakeCSVLineSample(line []string) Demo_CSVLineSample {
	xutc, time_err := Demo_ConvertCSVTime(line[0])
	if time_err != nil {
		pkg.Trace(time_err)
	}

	vt := float32(0)
	vp := float32(0)
	mode := pkg.StringToInt32(strings.Trim(line[9], ""))
	if mode == 1 {
		vt = 6
		vp = 6
	}

	s := Demo_CSVLineSample{
		xutc.UnixMicro(),                     // Time
		pkg.StringToFloat32(line[4]),         // CH4
		pkg.StringToFloat32(line[5]),         // High Flow
		pkg.StringToFloat32(line[7]),         // Low Flow
		pkg.StringToFloat32(line[3]),         // Pressure
		pkg.StringToFloat32(line[1]) / 27,    // Battery
		pkg.StringToFloat32(line[1]),         // Battery
		pkg.StringToFloat32(line[1]) * 0.975, // Motor
		vt,                                   // Valve Target
		vp,                                   // Valve Position
	}

	return s
}
func (s Demo_CSVLineSample) Print(hdr string) {
	fmt.Printf(
		"\n%s\n\tDemo_CSVLineSample:\t%d, %f, %f, %f, %f, %f, %f, %f, %f, %f\n\n",
		hdr, s.Time, s.CH4, s.HF, s.LF, s.P, s.BC, s.BV, s.MV, s.VT, s.VP,
	)
}
func (s Demo_CSVLineSample) Write(job *cv.Job) {
	ts := cv.Sample{
		SmpJobName: job.DESJobName,
		SmpTime:    s.Time,
		SmpCH4:     s.CH4,
		SmpHiFlow:  s.HF,
		SmpLoFlow:  s.LF,
		SmpPress:   s.P,
		SmpBatAmp:  s.BC,
		SmpBatVolt: s.BV,
		SmpMotVolt: s.MV,
		SmpVlvTgt:  uint32(s.VT),
		SmpVlvPos:  uint32(s.VP),
	}
	ts.WriteSample(job)
}
func (s Demo_CSVLineSample) Incs(s0 Demo_CSVLineSample, qty int64) Demo_CSVLineSample {
	qF := float32(qty)
	return Demo_CSVLineSample{
		(s.Time - s0.Time) / qty,
		(s.CH4 - s0.CH4) / qF,
		(s.HF - s0.HF) / qF,
		(s.LF - s0.LF) / qF,
		(s.P - s0.P) / qF,
		(s.BC - s0.BC) / qF,
		(s.BV - s0.BV) / qF,
		(s.MV - s0.MV) / qF,
		s0.VT,
		s0.VT,
	}
}
func (s Demo_CSVLineSample) CH4Rand(inc, a float32) float32 {
	return Demo_RandFill(100, 0.005, s.CH4, inc, a)
}
func (s Demo_CSVLineSample) HFRand(inc, a float32) float32 {
	return Demo_RandFill(250, 0.25, s.HF, inc, a)
}
func (s Demo_CSVLineSample) LFRand(inc, a float32) float32 {
	return Demo_RandFill(2, 0.25, s.LF, inc, a)
}
func (s Demo_CSVLineSample) PRand(inc, a float32) float32 {
	return Demo_RandFill(1500, 0.005, s.P, inc, a)
}
func (s Demo_CSVLineSample) BCRand(inc, a float32) float32 {
	return Demo_RandFill(8, 0.5, s.BC, inc, a)
}
func (s Demo_CSVLineSample) BVRand(inc, a float32) float32 {
	return Demo_RandFill(15, 0.25, s.BV, inc, a)
}
func (s Demo_CSVLineSample) MVRand(inc, a float32) float32 {
	return Demo_RandFill(15, 0.25, s.MV, inc, a)
}
func Demo_RandFill(span, res, v, inc, a float32) float32 {
	nv := v + (inc * a)
	var m float32 = span / 100 * res * nv

	min := nv - (m / 2)
	max := nv + (m / 2)
	vn := min + rand.Float32()*(max-min)

	return vn
}

/*DEMO CSV SIM -> PUBLISH TO MQTT */
func (demo *DemoDeviceClient) Demo_Run_Sim_CSV(file *os.File, sim Sim) {
	file, err := os.Open(file.Name())
	if err != nil {
		pkg.Trace(err)
	}
	defer file.Close()

	lines, err := csv.NewReader(file).ReadAll()
	if err != nil {
		pkg.Trace(err)
	} // fmt.Printf("\n Demo_Run_Sim_CSV()... len(lines): %d\n", len(lines) )
	dat := Demo_ParseCSV_TSXY(lines, sim.FillQty) // fmt.Printf("\n Demo_Run_Sim_CSV()... len(dat): %d\n", len(dat) )

	i := 1
	if sim.Qty < 0 {
		sim.Qty = len(dat[0].Data)
	}
	for i < sim.Qty {

		mqtts := Demo_EncodeMQTTSampleMessage(demo.Job.LastConfig.CfgJobName, i, dat)

		demo.MQTTPublication_DemoDeviceClient_SIGSample(&mqtts)

		time.Sleep(time.Millisecond * time.Duration(sim.Dur))
		i++

	}

	demo.Client.Disconnect(200)
}

/*DEMO SIM -> PUBLISH TO MQTT */
func (demo *DemoDeviceClient) Demo_Run_Sim() {
	fmt.Printf("\n (demo *DemoDeviceClient) Demo_Run_Sim( ): demo.Sim.Dur %d\n", demo.Sim.Dur)
	fmt.Printf("\n (demo *DemoDeviceClient) Demo_Run_Sim( ): demo.Sim.Qty %d\n", demo.Sim.Qty)
	t0 := time.Now()
	i := 1
	for i < demo.Sim.Qty {

		mqtts := Demo_Make_Sim_Sample(t0, time.Now(), demo.DESJob.DESJobName)

		demo.MQTTPublication_DemoDeviceClient_SIGSample(&mqtts)

		time.Sleep(time.Millisecond * time.Duration(demo.Sim.Dur))
		i++

	}

	demo.MQTTDemoDeviceClient_Disconnect()

}

func YSinX(t0, ti time.Time, max, shift float64) (y float32) {

	freq := 0.5
	// timeT := time.UnixMicro(tumic)
	// time0 := time.UnixMicro(t0umic)
	dt := ti.Sub(t0).Seconds()

	// deltaT := float64( dt )

	a := max / 2

	return float32(a * (math.Sin(dt*freq + (freq / shift)) + 1))
}

func YCosX(t0, ti time.Time, max, shift float64) (y float32) {

	freq := 0.5
	// timeT := time.UnixMicro(tumic)
	// time0 := time.UnixMicro(t0umic)
	dt := ti.Sub(t0).Seconds()

	// deltaT := float64( dt )

	a := max / 2

	return float32(a * (math.Cos(dt*freq + (freq / shift)) + 1))
}


func Demo_Make_Sim_Sample(t0, ti time.Time, job string) cv.MQTTSample {

	tumic := ti.UnixMicro()
	data := []pkg.TimeSeriesData{
		/* "AAABgss3rYBCxs2nO2VgQj6qrwk/JpeNPv6JZUFWw+1BUWVuAAQABA==" */
		{ // methane
			Data: []pkg.TSDPoint{{X: tumic, Y: YSinX(t0, ti, 99.9, 0.1)}},
			Min:  90,
			Max:  110,
		},
		{ // high_flow
			Data: []pkg.TSDPoint{{X: tumic, Y: YCosX(t0, ti, 2.1, 0.3)}},
			Min:  0,
			Max:  1,
		},
		{ // low_flow
			Data: []pkg.TSDPoint{{X: tumic, Y: YSinX(t0, ti, 1.9, 0.5)}},
			Min:  0,
			Max:  1,
		},
		{ // pressure
			Data: []pkg.TSDPoint{{X: tumic, Y: YCosX(t0, ti, 599.9, 0.7)}},
			Min:  0,
			Max:  1,
		},
		{ // battery_current
			Data: []pkg.TSDPoint{{X: tumic, Y: YSinX(t0, ti, 0.349, 0.9)}},
			Min:  0,
			Max:  1.5,
		},
		{ // battery_voltage
			Data: []pkg.TSDPoint{{X: tumic, Y: YCosX(t0, ti, 13.9, 1.1)}},
			Min:  0,
			Max:  15,
		},
		{ // motor_voltage
			Data: []pkg.TSDPoint{{X: tumic, Y: YSinX(t0, ti, 12.9, 1.3)}},
			Min:  0,
			Max:  15,
		},
		{ // valve_target
			Data: []pkg.TSDPoint{{X: tumic, Y: 4}},
			Min:  0,
			Max:  10,
		},
		{ // valve_position
			Data: []pkg.TSDPoint{{X: tumic, Y: 4}},
			Min:  0,
			Max:  10,
		},
	}

	return Demo_EncodeMQTTSampleMessage(job, 0, data)
}

/*DEMO CSV -> DIRECTLY TO DATABASE */
func Demo_UploadCSV_TSDB(file *multipart.File, readQty int, fillQty int64, job cv.Job) {
	// fmt.Println("Demo_UploadCSV()...")
	csvr := csv.NewReader(*file)
	csvr.FieldsPerRecord = -1
	// lines, err := csvr.ReadAll()
	// if err != nil {
	// 	pkg.Trace(err)
	// }

	/* TODO: Write to database **************************************************************/
	// TODO: - INSERT Configs
	// TODO: - INSERT Events
	/*******************************************************************************************/

	// TODO: - INSERT Samples
	// Demo_ParseCSV_TSDB(lines, fillQty, job)
}
func Demo_ParseCSV_TSDB(lines [][]string, fillQty int64, job *cv.Job) {

	var print bool = false
	var print_one bool = true
	// var s0 Demo_CSVLineSample

	hdr := 1
	for i, line := range lines {
		if i > hdr {

			s1 := Demo_MakeCSVLineSample(line)
			/*********************************************************************************/
			/* Interpolate with noisy values ************************************************/
			if i > hdr+1 {
				// Demo_CSV_WriteTSDB_RandFill(s0, s1, fillQty, job)
			}
			// s0 = s1
			/*********************************************************************************/

			// INSERT INTO [job_table]...
			s1.Write(job)

			if print || print_one {
				s1.Print("Demo_ParseCSV_TSDBlines( ):")
				print_one = false
			}

		}
	}
}
func Demo_CSV_WriteTSDB_RandFill(s0, s1 Demo_CSVLineSample, fillQty int64, job *cv.Job) {
	// inc := s1.Incs(s0, fillQty)
	var i int64 = 1
	for i < fillQty {
		// a := float32(i)
		// ts := cv.SSESampleTSDPoint{
		// 	job.JobName,
		// 	s0.Time + (inc.Time * i),
		// 	s0.CH4Rand(inc.CH4, a),
		// 	s0.HFRand(inc.HF, a),
		// 	s0.LFRand(inc.LF, a),
		// 	s0.PRand(inc.P, a),
		// 	s0.BCRand(inc.BC, a),
		// 	s0.BVRand(inc.BV, a),
		// 	s0.MVRand(inc.MV, a),
		// 	uint32(s0.VT),
		// 	uint32(s0.VP),
		// }
		// // INSERT INTO [job_table]...
		// ts.WriteSample(job)
		i++
	}
}

/*DEMO CSV -> LIVE CHART UPDATE */
type Demo_TSXYSamples struct {
	CH4 pkg.TSXY
	HF  pkg.TSXY
	LF  pkg.TSXY
	P   pkg.TSXY
	BC  pkg.TSXY
	BV  pkg.TSXY
	MV  pkg.TSXY
	VT  pkg.TSXY
	VP  pkg.TSXY
}

// func Demo_LocalCSV_MQTT_SSE(sse *cv.SSEClient, readQty int, fillQty int64, job cv.Job) {
// 	file, err := os.Open(Demo_LocalCSV_Path)
// 	if err != nil {
// 		pkg.Trace(err)
// 	}
// 	defer file.Close()
// 	lines, err := csv.NewReader(file).ReadAll()
// 	if err != nil {
// 		pkg.Trace(err)
// 	}
// 	dat := Demo_ParseCSV_TSXY(lines, fillQty)

// 	i := 1
// 	if readQty < 0 {
// 		readQty = len(dat[0].Data)
// 	}

// 	run := true
// 	for i < readQty && run {
// 		select {

// 		// case run = <-sse.run:
// 		// 	fmt.Println("Demo_LocalCSV_MQTT_SSE():\tSTOPPED")

//			// case one := <-sse.one:
//			// 	ms := Demo_EncodeMQTTSampleMessage(job.Name, i, dat)
//			// 	js, err := json.Marshal(ms)
//			// 	if err != nil {
//			// 		pkg.Trace(err)
//			// 	} // fmt.Println(string(js))  // fmt.Printf("Demo_LocalCSV_MQTT_SSE( ):\tPublish:\t%d\n", i)
//			// 	if sse.active {
//			// 		sse.pub <- string(js)
//			// 	}
//				// i += one
//			}
//		}
//		fmt.Println("Demo_LocalCSV_MQTT_SSE():\tLOOP ENDED.")
//	}
func Demo_ParseCSV_TSXY(lines [][]string, fillQty int64) []pkg.TimeSeriesData {

	var print bool = false
	var print_one bool = true
	var xy Demo_TSXYSamples
	var s0 Demo_CSVLineSample

	hdr := 1
	for i, line := range lines {
		if i > hdr {

			s1 := Demo_MakeCSVLineSample(line)

			/*********************************************************************************/
			/* Interpolate with noisy values ************************************************/
			if i > hdr+1 {
				Demo_CSV_AppendTSXY_RandFill(&xy, s0, s1, fillQty)
			}
			s0 = s1
			/*********************************************************************************/

			if print || print_one {
				s1.Print("Demo_ParseCSV_TSXY( ):")
				print_one = false
			}

			Demo_CSV_AppendTSXY(&xy.CH4, s1.Time, s1.CH4)
			Demo_CSV_AppendTSXY(&xy.HF, s1.Time, s1.HF)
			Demo_CSV_AppendTSXY(&xy.LF, s1.Time, s1.LF)
			Demo_CSV_AppendTSXY(&xy.P, s1.Time, s1.P)
			Demo_CSV_AppendTSXY(&xy.BC, s1.Time, s1.BC)
			Demo_CSV_AppendTSXY(&xy.BV, s1.Time, s1.BV)
			Demo_CSV_AppendTSXY(&xy.MV, s1.Time, s1.MV)
			Demo_CSV_AppendTSXY(&xy.VT, s1.Time, s1.VT)
			Demo_CSV_AppendTSXY(&xy.VP, s1.Time, s1.VP)
			// } else {
			// 	fmt.Println(line)
		}
	}

	var margin float32 = 0.1
	return []pkg.TimeSeriesData{
		xy.CH4.TSD(margin), // 0
		xy.HF.TSD(margin),  // 1
		xy.LF.TSD(margin),  // 2
		xy.P.TSD(margin),   // 3
		xy.BC.TSD(margin),  // 4
		xy.BV.TSD(margin),  // 5
		xy.MV.TSD(margin),  // 6
		xy.VT.TSD(margin),  // 7
		xy.VP.TSD(margin),  // 8
	}
}
func Demo_CSV_AppendTSXY(tsxy *pkg.TSXY, x int64, y float32) {
	tsxy.X = append(tsxy.X, x)
	tsxy.Y = append(tsxy.Y, y)
}
func Demo_CSV_AppendTSXY_RandFill(tsxys *Demo_TSXYSamples, s0, s1 Demo_CSVLineSample, fillQty int64) {
	inc := s1.Incs(s0, fillQty)
	var i int64 = 1
	for i < fillQty {
		a := float32(i)
		t := s0.Time + (inc.Time * i)
		Demo_CSV_AppendTSXY(&tsxys.CH4, t, s0.CH4Rand(inc.CH4, a))
		Demo_CSV_AppendTSXY(&tsxys.HF, t, s0.HFRand(inc.HF, a))
		Demo_CSV_AppendTSXY(&tsxys.LF, t, s0.LFRand(inc.LF, a))
		Demo_CSV_AppendTSXY(&tsxys.P, t, s0.PRand(inc.P, a))
		Demo_CSV_AppendTSXY(&tsxys.BC, t, s0.BCRand(inc.BC, a))
		Demo_CSV_AppendTSXY(&tsxys.BV, t, s0.BVRand(inc.BV, a))
		Demo_CSV_AppendTSXY(&tsxys.MV, t, s0.MVRand(inc.MV, a))
		Demo_CSV_AppendTSXY(&tsxys.VT, t, s1.VT)
		Demo_CSV_AppendTSXY(&tsxys.VP, t, s1.VP)
		i++
	}
}
func Demo_EncodeMQTTSampleMessage(job string, i int, data []pkg.TimeSeriesData) cv.MQTTSample {
	// fmt.Println("\nDemo_EncodeMQTTSampleMessage()...")

	x := data[0].Data[i].X                  // fmt.Printf("Time:\t%d\n", x)
	var ch float32 = data[0].Data[i].Y      // fmt.Printf("CH4:\t%f\n", ch)
	var hf float32 = data[1].Data[i].Y      // fmt.Printf("High Flow:\t%f\n", hf)
	var lf float32 = data[2].Data[i].Y      // fmt.Printf("Low Flow:\t%f\n", lf)
	var p float32 = data[3].Data[i].Y       // fmt.Printf("Pressure:\t%f\n", p)
	var bc float32 = data[4].Data[i].Y      // fmt.Printf("Batt C:\t%f\n", bc)
	var bv float32 = data[5].Data[i].Y      // fmt.Printf("Batt V:\t%f\n", bv)
	var mv float32 = data[6].Data[i].Y      // fmt.Printf("Motor V:\t%f\n", mv)
	var vt int16 = int16(data[7].Data[i].Y) // fmt.Printf("Target V:\t%d\n", vt)
	var vp int16 = int16(data[8].Data[i].Y) // fmt.Printf("Target V:\t%d\n", vp)

	var hex []byte
	hex = append(hex, pkg.GetBytes(x)...)
	hex = append(hex, pkg.GetBytes(ch)...)
	hex = append(hex, pkg.GetBytes(hf)...)
	hex = append(hex, pkg.GetBytes(lf)...)
	hex = append(hex, pkg.GetBytes(p)...)
	hex = append(hex, pkg.GetBytes(bc)...)
	hex = append(hex, pkg.GetBytes(bv)...)
	hex = append(hex, pkg.GetBytes(mv)...)
	hex = append(hex, pkg.GetBytes(vt)...)
	hex = append(hex, pkg.GetBytes(vp)...)
	// fmt.Printf("Hex:\t%X\n", hex)

	b64 := pkg.BytesToBase64(hex)
	// fmt.Printf("Base64:\t%s\n\n", b64)

	msg := cv.MQTTSample{
		JobID: job,
		Data:  []string{b64},
	}

	return msg
}

/*TEST*/
func Demo_Test_EncodeDecodeMQTTSampleMessage() {
	job := "VMDEMO0000-1688655646185033"
	data := []pkg.TimeSeriesData{
		/* "AAABgss3rYBCxs2nO2VgQj6qrwk/JpeNPv6JZUFWw+1BUWVuAAQABA==" */
		{ // methane
			Data: []pkg.TSDPoint{{X: 1661266800000, Y: 99.401665}},
			Min:  90,
			Max:  110,
		},
		{ // high_flow
			Data: []pkg.TSDPoint{{X: 1661266800000, Y: 0.0035}},
			Min:  0,
			Max:  1,
		},
		{ // low_flow
			Data: []pkg.TSDPoint{{X: 1661266800000, Y: 0.33336666}},
			Min:  0,
			Max:  1,
		},
		{ // pressure
			Data: []pkg.TSDPoint{{X: 1661266800000, Y: 0.65075}},
			Min:  0,
			Max:  1,
		},
		{ // battery_current
			Data: []pkg.TSDPoint{{X: 1661266800000, Y: 0.497142}},
			Min:  0,
			Max:  1.5,
		},
		{ // battery_voltage
			Data: []pkg.TSDPoint{{X: 1661266800000, Y: 13.422833}},
			Min:  0,
			Max:  15,
		},
		{ // motor_voltage
			Data: []pkg.TSDPoint{{X: 1661266800000, Y: 13.087263}},
			Min:  0,
			Max:  15,
		},
		{ // valve_target
			Data: []pkg.TSDPoint{{X: 1661266800000, Y: 4}},
			Min:  0,
			Max:  10,
		},
		{ // valve_position
			Data: []pkg.TSDPoint{{X: 1661266800000, Y: 4}},
			Min:  0,
			Max:  10,
		},
	}

	var encodeOK = "OK"
	s := Demo_EncodeMQTTSampleMessage(job, 0, data)
	fmt.Println(s.Data[0])
	if s.Data[0] != "AAABgss3rYBCxs2nO2VgQj6qrwk/JpeNPv6JZUFWw+1BUWVuAAQABA==" {
		encodeOK = "FAILED"
	}
	enc_js, enc_err := json.MarshalIndent(s, "", "    ")
	if enc_err != nil {
		pkg.Trace(enc_err)
	}
	fmt.Printf("EncodeDemoMQTTSampleData( ):\n%s\nENCODE:\t%s\n\n", string(enc_js), encodeOK)

	// var decodeOK = "OK"
	// tss := DecodeMQTTSampleMessage(enc_js)
	// for _, ts := range tss {
	// 	if ts.JobID != job {
	// 		decodeOK = "FAILED"
	// 	}
	// 	dec_js, dec_err := json.MarshalIndent(ts, "", "    ")
	// 	if dec_err != nil {
	// 		pkg.Trace(dec_err)
	// 	}
	// 	fmt.Printf("DecodeDemoMQTTSample( ):\n%s\nDECODE:\t%s\n\n", string(dec_js), decodeOK)
	// }
}

/*WORK IN PROGRESS*/
func Demo_LocalCSV_SSE(ctx context.Context, c *chan string, job string, readQty int, fillQty int64, dur time.Duration) {
	// file, err := os.Open(Demo_LocalCSV_Path)
	// if err != nil {
	// 	pkg.Trace(err)
	// }
	// defer file.Close()
	// lines, err := csv.NewReader(file).ReadAll()
	// if err != nil {
	// 	pkg.Trace(err)
	// }
	// dat := Demo_ParseCSV_TSDB(lines, fillQty)
	// i := 1
	// if readQty < 0 {
	// 	readQty = len(dat[0].Data)
	// }
	// run := true
	// for i < readQty && run {
	// 	select {
	// 	case <-ctx.Done():
	// 		run = false
	// 	default:
	// 		s := Demo_NewSSESample(job, i, dat)
	// 		js, err := json.Marshal(s)
	// 		if err != nil {
	// 			pkg.Trace(err)
	// 		} // fmt.Println(js) // fmt.Printf("DemoSSE_CSV( %d )\n", i)

	// 		*c <- string(js)
	// 		time.Sleep(dur)
	// 		i++
	// 	}
	// }
}
