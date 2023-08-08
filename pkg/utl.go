package pkg

import (
	"encoding/json"
	"fmt"
	"net/http"
	"runtime"
)

func Trace(err error) error {
	pc, file, line, _ := runtime.Caller(1)
	name := runtime.FuncForPC(pc).Name()
	/* TODO: LOG THIS SOME PLACE */
	fmt.Printf("***ERROR***\n\tFile :\t%s\n\tFunc  :\t%s\n\tLine  :\t%d\ntError :\n\t%s\n\n", file, name, line, err.Error())
	return err
}

func HTTPErr(w *http.ResponseWriter, err error) {
	Trace(err)
	http.Error(*w, err.Error(), http.StatusInternalServerError)
}

func HTTPReqErr(w *http.ResponseWriter, err error) {
	Trace(err)
	http.Error(*w, err.Error(), http.StatusBadRequest)
}

func Json( name string, v any ) {
	js, err := json.MarshalIndent(v, "", "\t")
	if err != nil {
		Trace(err)
	}
	fmt.Printf("\nJSON: %s:\n%s\n", name, string(js))
}

