package c001v001

import (
	"github.com/leehayford/go-sveltekit/pkg"
)

/* SQLITE - DEVELOPMENT - JOB DATABASE - EVENT TABLE */
const CREATE_EVENT_TABLE string = `CREATE TABLE event (
    evt_id BIGSERIAL PRIMARY KEY,

    evt_time BIGINT NOT NULL,
    evt_addr TEXT,
    evt_user_id BIGINT NOT NULL,
    evt_app TEXT NOT NULL,

    evt_type_id BIGINT REFERENCES event_type (etyp_id),
    evt_title TEXT NOT NULL,
    evt_message TEXT NOT NULL
);`

/*
EVENT - AS WRITTEN TO JOB DATABASE
*/
type EventJDB struct {
	EvtID int64 `json:"evt_id"`
	MQTTEvent
}

func (evt *EventJDB) WriteEvent(job *Job) (err error) {
	q := `INSERT INTO event ( 
		evt_time, 
		evt_addr, 
		evt_user_id, 
		evt_app, 

		evt_type_id, 
		evt_title, 
		evt_message 
	) 
	VALUES ( $1, $2, $3, $4, $5, $6, $7 )`
	p := []interface{}{
		evt.EvtTime,
		evt.EvtAddr,
		evt.EvtUserID,
		evt.EvtApp,

		evt.EvtTypeID,
		evt.EvtTitle,
		evt.EvtMsg,
	}
	return job.JDB().Execute(q, p)
}

/*Get one Event*/
func (event *EventJDB) GetEvent(job *Job, qry string, params []interface{}) (err error) {

	rows, err := job.JDB().Select(qry, params)
	if err != nil {
		return err
	}
	defer rows.Close()

	rows.Next()
	err = rows.Scan(
		&event.EvtID,

		&event.EvtTime,
		&event.EvtAddr,
		&event.EvtUserID,
		&event.EvtApp,

		&event.EvtTypeID,
		&event.EvtTitle,
		&event.EvtMsg,
	)
	if err != nil {
		return err
	} // pkg.Json("(job *Job) GetEvent( ) -> event:", event)

	return err
}
func (event *EventJDB) GetEventByID(job *Job, id int64) (err error) {
	q := `SELECT DISTINCT * FROM event WHERE evt_id = $1 ORDER BY evt_time DESC`
	p := []interface{}{id}
	return event.GetEvent(job, q, p)
}
func (event *EventJDB) GetEventByTime(job *Job, t int64) (err error) {
	q := `SELECT DISTINCT * FROM event WHERE evt_time = $1 ORDER BY evt_id DESC`
	p := []interface{}{t}
	return event.GetEvent(job, q, p)
}

/* SQLITE - DEVELOPMENT - JOB DATABASE - EVENT TYPE TABLE */
const CREATE_EVENT_TYPE_TABLE string = `CREATE TABLE event_type (
    etyp_id BIGSERIAL PRIMARY KEY,
    etyp_name TEXT NOT NULL,
	etyp_description TEXT
);`

/*ADMIN EVENT TYPES*/
const REGISTER_DEVICE_EVENT_TYPE_ID = int64(1)
const INSERT_EVENT_TYPE_ADMIN_REGISTER_DEVICE string = `INSERT INTO event_type ( etyp_name, etyp_description ) 
VALUES ( 'DEVICE REGISTRATION',  'This happens when a device is registered to this Data Exchange Server (DES).' )`

/*OPERATIONAL EVENT TYPES*/
const JOB_START_EVENT_TYPE_ID = int64(2)
const INSERT_EVENT_TYPE_CONFIG_JOB_START string = `INSERT INTO event_type (  etyp_name, etyp_description ) 
VALUES ( 'JOB STARTED', ' ' )`
const INSERT_EVENT_TYPE_CONFIG_JOB_END string = `INSERT INTO event_type ( etyp_name, etyp_description )
 VALUES ( 'JOB ENDED', ' ' )`
const INSERT_EVENT_TYPE_CONFIG_CHANGE string = `INSERT INTO event_type ( etyp_name, etyp_description )
 VALUES ( 'OPERATIONAL CONFIGURATION CHANGED', ' ' )`
const INSERT_EVENT_TYPE_SSP string = `INSERT INTO event_type ( etyp_name, etyp_description )
 VALUES ( 'SHUT-IN PRESSURE STABILIZED', ' ' )`

/*OPERATION ALARM EVENT TYPES*/
const INSERT_EVENT_TYPE_ALARM_HIGH_CURRENT string = `INSERT INTO event_type ( etyp_name, etyp_description )
VALUES ( 'HIGH CURRENT ALARM', ' ' )`
const INSERT_EVENT_TYPE_ALARM_LOW_VOLTAGE string = `INSERT INTO event_type ( etyp_name, etyp_description )
VALUES ( 'LOW VOLTAGE ALARM', ' ' )`
const INSERT_EVENT_TYPE_ALARM_HIGH_PRESSURE string = `INSERT INTO event_type ( etyp_name, etyp_description )
VALUES ( 'HIGH PRESSURE ALARM', ' ' )`
const INSERT_EVENT_TYPE_ALARM_HIGH_FLOW string = `INSERT INTO event_type ( etyp_name, etyp_description )
VALUES ( 'HIGH FLOW ALARM', ' ' )`

/*OPERATION MODE EVENT TYPES*/
const INSERT_EVENT_TYPE_MODE_VENT string = `INSERT INTO event_type ( etyp_name, etyp_description )
VALUES ( 'VENT MODE', ' ' )`
const INSERT_EVENT_TYPE_MODE_BUILD string = `INSERT INTO event_type ( etyp_name, etyp_description )
VALUES ( 'BUILD MODE', ' ' )`
const INSERT_EVENT_TYPE_MODE_HIGH_FLOW string = `INSERT INTO event_type ( etyp_name, etyp_description )
VALUES ( 'HIGH FLOW MODE', ' ' )`
const INSERT_EVENT_TYPE_MODE_LOW_FLOW string = `INSERT INTO event_type ( etyp_name, etyp_description )
VALUES ( 'LOW FLOW MODE', ' ' )`

/* EVENT TYPE - AS WRITTEN TO JOB DATABASE */
type EventType struct {
	ETypeID   int64  `json:"etype_id"`
	ETypeName string `json:"etype_name"`
	ETypeDesc string `json:"etype_desc"`
}

/*Get many EventTypes*/
func GetEventTypes(job *Job, qry string, params []interface{}) ([]EventType, error) {
	var event_types []EventType

	rows, err := job.JDB().Select(qry, params)
	if err != nil {
		pkg.Trace(err)
	}
	defer rows.Close()
	for rows.Next() {
		var event_type EventType
		err = rows.Scan(
			&event_type.ETypeID,
			&event_type.ETypeName,
			&event_type.ETypeDesc,
		)
		if err != nil {
			pkg.Trace(err)
		}
		event_types = append(event_types, event_type)
	}

	return event_types, err
}

/*Get one EventType*/
func GetEventType(job *Job, qry string, params []interface{}) (EventType, error) {
	var event_type EventType

	rows, err := job.JDB().Select(qry, params)
	if err != nil {
		pkg.Trace(err)
	}
	defer rows.Close()
	for rows.Next() {
		err = rows.Scan(
			&event_type.ETypeID,
			&event_type.ETypeName,
			&event_type.ETypeDesc,
		)
		if err != nil {
			pkg.Trace(err)
		}
	}

	return event_type, err
}
func GetEventTypeByID(job *Job, id int64) (EventType, error) {
	q := `SELECT DISTINCT * FROM event_type WHERE etyp_id = $1`
	p := []interface{}{id}
	return GetEventType(job, q, p)
}
