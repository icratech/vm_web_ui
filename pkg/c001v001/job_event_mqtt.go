package c001v001

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/leehayford/go-sveltekit/pkg"
)

/*
EVENT - MQTT MESSAGE STRUCTURE
*/
type MQTTEvent struct {
	EvtTime   int64  `json:"evt_time"`
	EvtAddr   string `json:"evt_addr"`
	EvtUserID int64  `json:"evt_user_id"`
	EvtApp    string `json:"evt_app"`

	EvtTypeID int64  `json:"evt_type_id"`
	EvtTitle  string `json:"evt_title"`
	EvtMsg    string `json:"evt_msg"`
}

/* SIG TOPICS - EVENT   */
func MQTTTopic_SIGEvent(serial string) (topic string) {
	return fmt.Sprintf("%s/%s/%s/sig/event",
		DEVICE_CLASS,
		DEVICE_VERSION,
		serial,
	)
}

/* SIG MESSAGE LOGGER - EVENT */
func (evt *EventJDB) WriteMQTTEvent(job *Job, msg []byte) (err error) {

	// Unpack the Event message into an EventJDB
	if err = json.Unmarshal(msg, evt); err != nil {
		return pkg.Trace(err)
	}

	// Write the EventJDB to the job database
	if err = evt.WriteEvent(job); err != nil {
		return err
	}
	return err
}

type SSEEvent struct {
	Type string   `json:"type"`
	Data EventJDB `json:"data"`
}

/* SIG MESSAGE SSE SHIPPER - EVENT */
func (evt *EventJDB) SendSSEEvent(job *Job, chOut chan string, msg []byte) (err error) {
	/* WRANGLE SSE DATA */
	if err := json.Unmarshal(msg, &evt); err != nil {
		pkg.Trace(err)
	}
	/*
		WAIT FOR THE DEVICE CLIENT SUBSCRIPTION HANDLER TO LOG THE MESSAGE
		- GO GET IT FROM THE JDB
		- SO WE CAN SHIP IT WITH A VALID D ( != 0 )
	*/
	time.Sleep(time.Millisecond * 500)
	evt.GetEventByTime(job, evt.EvtTime)

	js, err := json.Marshal(SSEEvent{Type: "event", Data: *evt})
	if err != nil {
		pkg.Trace(err)
	}

	/* SEND SSE DATA */
	chOut <- string(js)
	return err
}

/* CMD TOPICS - EVENT   */
func MQTTTopic_CMDEvent(serial string) (topic string) {
	return fmt.Sprintf("%s/%s/%s/cmd/event",
		DEVICE_CLASS,
		DEVICE_VERSION,
		serial,
	)
}

/* CMD MESSAGE CONSTRUCTORS - EVENT */
func (evt *MQTTEvent) MQTTMessage_CMDEvent() string {
	msg, err := json.Marshal(evt)
	if err != nil {
		pkg.Trace(err)
	}
	return string(msg)
}
