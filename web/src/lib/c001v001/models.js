

import { client_app } from '../des/app'
import { debug } from '../des/utils'
import { DESRegistration } from '../des/api'

import { validateMeasuredValue } from '../des/device'


/* TODO : REPLACE WITH ENV VARIABLES FOR PRODUCTION *******************************/
export const device_class = "001"
export const device_version= "001"
/* TODO : END REPLACE WITH ENV VARIABLES FOR PRODUCTION *******************************/

export const newC001V001_DESRegistration = ( )=> {
    let reg = new DESRegistration( )
    reg.des_dev_class = device_class
    reg.des_dev_version = device_version
    return reg
}

export const MIN_SAMPLE_PERIOD = 1000 /* TODO: SET TO 1000 */
export const DEFAULT_CFG_SSP_DUR =  2 * 3600 * 1000  // 21,600,000 (six hours)
export const DEFAULT_CFG_SSCVF_DUR = 2 * 3600 * 1000  // 7,200,000 (two hours)

/* OPERATION CODES ( Event.EvtCode 0 : 999 ) *******************************************************/
export const OP_CODES = {
    DES_REG_REQ: 0,    // USER REQUEST -> CHANGE DEVICE'S OPERATIONAL DATA EXCHANGE SERVER
    DES_REGISTERED: 1, // DEVICE RESPONSE -> SENT TO NEW DATA EXCHANGE SERVER
    JOB_ENDED: 2,      // DEVICE RESPONSE -> JOB ENDED
    JOB_START_REQ: 3,  // USER REQUEST -> START JOB
    JOB_STARTED: 4,    // DEVICE RESPONSE -> JOB STARTED
    JOB_END_REQ: 5,    // USER REQUEST -> END JOB
    JOB_OFFLINE_START: 6, // DES NOTIFICATION -> A JOB WAS STARTED OFFLINE
    JOB_OFFLINE_END: 7, // DES NOTIFICATION -> A JOB WAS ENDED OFFLINE
    GPS_ACQ: 8, // DEVICE NOTIFICATION -> DEVICE LTE IS OFF WHILE ACQUIRING GPS

    SYSTEM_EVENT: 1000,    // 1000 TO 1999 ARE ALARMS AND NOTIFICATIONS CREATED BY DEVICE / DES DURING THE JOB
    OPERATOR_EVENT: 2000,    // OPERATOR CREATED AN EVENT DURING THE JOB
    REPORT_EVENT: 2001    // REPORT EDITOR CREATED AN EVENT AFTER THE JOB
}

/* MODE ( VALVE POSITIONS ) *************************************************************************/
export const MODES = {
    BUILD: 0,
    MOVE_BV: 1,
    VENT: 2,
    MOVE_VF: 3,
    HI_FLOW: 4,
    MOVE_HL: 5,
    LO_FLOW: 6,
    ERR: 7
}

export const getMode = ( cfg, smp ) => {

    let ctgt = cfg.cfg_vlv_tgt
    let cpos = cfg.cfg_vlv_pos
    
    let spos = smp.smp_vlv_pos

    if ( ctgt != cpos ) {

        switch ( ctgt ) {

            case MODES.BUILD:  return MODES.MOVE_BV
    
            case MODES.VENT: 
                if ( cpos === MODES.BUILD )
                    return MODES.MOVE_BV
                else
                    return MODES.MOVE_VF
    
            case MODES.HI_FLOW: 
                if ( cpos === MODES.VENT )
                    return MODES.MOVE_VF
                else 
                    return MODES.MOVE_HL

            case MODES.LO_FLOW: return MODES.MOVE_HL

            default: return MODES.ERR     
            
        }

    } else {

        switch ( cpos ) {

            case MODES.BUILD: return MODES.BUILD
    
            case MODES.VENT: return MODES.VENT
    
            case MODES.HI_FLOW: return MODES.HI_FLOW
            
            case MODES.LO_FLOW: return MODES.LO_FLOW

            default: return MODES.ERR     
        
        }

    }


}

/* 
WEB CLIENT -> HTTP -> DES -> MQTT -> DEVICE  
  - Device updates its administration settings
  - Device returns new administration settings
WEB CLIENT <- HTTP <- DES <- MQTT <- DEVICE  
*/
export class Admin {
    constructor( 
        adm_time = 0,
        adm_addr = "",
        adm_user_id = "",
        adm_app = client_app,
    
        adm_def_host = "",
        adm_def_port = 0,
        adm_op_host = "",
        adm_op_port = 0,
    
        adm_bat_hi_amp = 2.5, // Amps
        adm_bat_lo_volt = 10.5, // Volts
    
        adm_mot_hi_amp = 1.9, // Amps
    
        adm_press = 6894.8, // kPa
        adm_press_min = 689.5, // kPa
        adm_press_max = 6894.8, // kPa
    
        adm_hfs_flow = 200.0, // L/min
        adm_hfs_flow_min =150.0, // L/min
        adm_hfs_flow_max = 250.0, // L/min
        adm_hfs_press =1103.1, // kPa
        adm_hfs_press_min = 158.6, // kPa
        adm_hfs_press_max = 1378.9, // kPa
        adm_hfs_diff = 448.2, // psi
        adm_hfs_diff_min = 68.9, // kPa
        adm_hfs_diff_max = 517.1, // kPa
    
        adm_lfs_flow = 1.85, // L/min
        adm_lfs_flow_min = 0.5, // L/min
        adm_lfs_flow_max = 2.0, // L/min
        adm_lfs_press = 413.7, // kPa
        adm_lfs_press_min = 137.9, // kPa
        adm_lfs_press_max = 551.5, // kPa
        adm_lfs_diff = 62.0, // kPa
        adm_lfs_diff_min = 13.8, // kPa
        adm_lfs_diff_max = 68.9, // kPa
     ) {
        this.adm_time = adm_time,
        this.adm_addr = adm_addr,
        this.adm_user_id = adm_user_id,
        this.adm_app = adm_app,
    
        this.adm_def_host = adm_def_host,
        this.adm_def_port = adm_def_port,
        this.adm_op_host = adm_op_host,
        this.adm_op_port = adm_op_port,
        
        this.adm_bat_hi_amp = adm_bat_hi_amp, // Amps
        this.adm_bat_lo_volt = adm_bat_lo_volt, // Volts
    
        this.adm_mot_hi_amp = adm_mot_hi_amp, // Amps
    
        this.adm_press = adm_press, // kPa
        this.adm_press_min = adm_press_min, // kPa
        this.adm_press_max = adm_press_max, // kPa

        this.adm_hfs_flow = adm_hfs_flow, // L/min
        this.adm_hfs_flow_min =adm_hfs_flow_min, // L/min
        this.adm_hfs_flow_max = adm_hfs_flow_max, // L/min
        this.adm_hfs_press = adm_hfs_press, // kPa
        this.adm_hfs_press_min = adm_hfs_press_min, // kPa
        this.adm_hfs_press_max = adm_hfs_press_max, // kPa
        this.adm_hfs_diff = adm_hfs_diff, // kPa
        this.adm_hfs_diff_min = adm_hfs_diff_min, // kPa
        this.adm_hfs_diff_max = adm_hfs_diff_max, // kPa
    
        this.adm_lfs_flow = adm_lfs_flow, // L/min
        this.adm_lfs_flow_min = adm_lfs_flow_min, // L/min
        this.adm_lfs_flow_max = adm_lfs_flow_max, // L/min
        this.adm_lfs_press = adm_lfs_press, // kPa
        this.adm_lfs_press_min = adm_lfs_press_min, // kPa
        this.adm_lfs_press_max = adm_lfs_press_max, // kPa
        this.adm_lfs_diff = adm_lfs_diff, // kPa
        this.adm_lfs_diff_min = adm_lfs_diff_min, // kPa
        this.adm_lfs_diff_max = adm_lfs_diff_max // kPa
    }
}
/* 
WEB CLIENT -> HTTP -> DES ( LOG ) -> MQTT -> DEVICE  
  - Device returns readonly state values
WEB CLIENT <- HTTP <- ( JOB DB WRITE ) DES <- MQTT <- DEVICE  
*/
export class State {
    constructor(
        sta_time = 0,
        sta_addr = "",
        sta_user_id = "",
        sta_app = client_app,

        sta_serial = "",
        sta_version = device_version,
        sta_class = device_class,

        sta_log_fw = "00.00.000",
        sta_mod_fw = "00.00.000",

        sta_logging = 0,
        sta_job_name = "",

        sta_stm_uid1 = 0,
        sta_stm_uid2 = 0,
        sta_stm_uid3 = 0
    
    ) {
        this.sta_time = sta_time
        this.sta_addr = sta_addr
        this.sta_user_id = sta_user_id
        this.sta_app = sta_app

        this.sta_serial = sta_serial
        this.sta_version = sta_version
        this.sta_class = sta_class

        this.sta_log_fw = sta_log_fw
        this.sta_mod_fw = sta_mod_fw  

        this.sta_logging = sta_logging
        this.sta_job_name = sta_job_name
        
        this.sta_stm_uid1 = sta_stm_uid1
        this.sta_stm_uid2 = sta_stm_uid2
        this.sta_stm_uid3 = sta_stm_uid3
    }
}

/* 
WEB CLIENT -> HTTP -> DES ( LOG ) -> MQTT -> DEVICE  
  - Device updates its header settings
  - Device returns new header settings
WEB CLIENT <- HTTP <- ( JOB DB WRITE ) DES <- MQTT <- DEVICE  
*/
export class Header {
    constructor(
        hdr_time = 0, 
        hdr_addr = "",  
        hdr_user_id = "",
        hdr_app =  client_app,
    
        /*WELL INFORMATION*/
        hdr_well_co = "", 
        hdr_well_name = "",
        hdr_well_sf_loc = "",
        hdr_well_bh_loc = "",
        hdr_well_lic = "",

        /* JOB NAME, START & STOP */
        hdr_job_start = 0,
        hdr_job_end = 0,

        /*GEO LOCATION */
        hdr_geo_lng = 0,
        hdr_geo_lat = 0
    ) {
        this.hdr_time = hdr_time
        this.hdr_addr = hdr_addr
        this.hdr_user_id = hdr_user_id
        this.hdr_app = hdr_app

        this.hdr_well_co = hdr_well_co
        this.hdr_well_name = hdr_well_name
        this.hdr_well_sf_loc = hdr_well_sf_loc
        this.hdr_well_bh_loc = hdr_well_bh_loc
        this.hdr_well_lic = hdr_well_lic

        this.hdr_job_start = hdr_job_start
        this.hdr_job_end = hdr_job_end
        this.hdr_geo_lng = hdr_geo_lng
        this.hdr_geo_lat = hdr_geo_lat
    }
}
export const validateLngLat = ( lng, lat ) => {
    
    let validLng = validateMeasuredValue( lng )
    if ( validLng === null ) { validLng = -180 }

    let validLat = validateMeasuredValue( lat ) 
    if ( validLat === null ) { validLat = 90 }

    return [ validLng, validLat ]
}

/* 
WEB CLIENT -> HTTP -> DES ( LOG ) -> MQTT -> DEVICE  
  - Device updates its configuration settings
  - Device returns new configuration settings
WEB CLIENT <- HTTP <- ( JOB DB WRITE ) DES <- MQTT <- DEVICE  
*/
export class Config {
    constructor( 
        cfg_time = 0, 
        cfg_addr = "",  
        cfg_user_id = "",
        cfg_app =  client_app,
    
        cfg_scvd = 596.8, // m
        cfg_scvd_mult = 10.5, // kPa / m
        cfg_ssp_rate = 1.95, // kPa / hour
        cfg_ssp_dur = DEFAULT_CFG_SSP_DUR, // milliseconds
        cfg_hi_scvf = 201.4, //  L/min ( 290 m3/day )
        cfg_flow_tog = 1.85, //  L/min 
        cfg_sscvf_dur = DEFAULT_CFG_SSCVF_DUR, // milliseconds
    
        cfg_vlv_tgt = 2, // vent
        cfg_vlv_pos = 2, // vent
    
        cfg_op_sample = MIN_SAMPLE_PERIOD, // milliseconds
        cfg_op_log = MIN_SAMPLE_PERIOD * 10, // milliseconds
        cfg_op_trans = MIN_SAMPLE_PERIOD * 60, // milliseconds
        
        cfg_diag_sample = MIN_SAMPLE_PERIOD * 10, // milliseconds
        cfg_diag_log = MIN_SAMPLE_PERIOD * 100, // milliseconds
        cfg_diag_trans = MIN_SAMPLE_PERIOD * 600, // milliseconds
     ) {
        this.cfg_time = cfg_time
        this.cfg_addr = cfg_addr
        this.cfg_user_id = cfg_user_id
        this.cfg_app = cfg_app
    
        this.cfg_scvd = cfg_scvd // m
        this.cfg_scvd_mult = cfg_scvd_mult // kPa / m
        this.cfg_ssp_rate = cfg_ssp_rate // kPa / hour
        this.cfg_ssp_dur = cfg_ssp_dur // milliseconds
        this.cfg_hi_scvf = cfg_hi_scvf //  L/min ( 290 m3/day )
        this.cfg_flow_tog = cfg_flow_tog //  L/min 
        this.cfg_sscvf_dur = cfg_sscvf_dur // milliseconds
    
        this.cfg_vlv_tgt = cfg_vlv_tgt // vent
        this.cfg_vlv_pos = cfg_vlv_pos // vent
    
        this.cfg_op_sample = cfg_op_sample // milliseconds
        this.cfg_op_log = cfg_op_log // milliseconds
        this.cfg_op_trans = cfg_op_trans // milliseconds
        
        this.cfg_diag_sample = cfg_diag_sample // milliseconds
        this.cfg_diag_log = cfg_diag_log // milliseconds
        this.cfg_diag_trans = cfg_diag_trans // milliseconds
    }

}
export const validateCFG = ( cfg ) => { 
    cfg.cfg_scvd = parseFloat( cfg.cfg_scvd )
    cfg.cfg_scvd_mult = parseFloat( cfg.cfg_scvd_mult )

    cfg.cfg_ssp_rate = parseFloat( cfg.cfg_ssp_rate )
    cfg.cfg_ssp_dur = Math.floor( parseInt( cfg.cfg_ssp_dur ) )
    
    cfg.cfg_hi_scvf = parseFloat( cfg.cfg_hi_scvf )
    cfg.cfg_flow_tog = parseFloat( cfg.cfg_flow_tog )
    cfg.cfg_sscvf_dur = Math.floor( parseInt( cfg.cfg_sscvf_dur ) )

    cfg.cfg_op_sample = Math.floor( parseInt( cfg.cfg_op_sample ) )
    cfg.cfg_op_log = Math.floor( parseInt( cfg.cfg_op_log ) )
    cfg.cfg_op_trans = Math.floor( parseInt( cfg.cfg_op_trans ) )
    
    cfg.cfg_diag_sample = Math.floor( parseInt( cfg.cfg_diag_sample ) )
    cfg.cfg_diag_log = Math.floor( parseInt( cfg.cfg_diag_log ) )
    cfg.cfg_diag_trans = Math.floor( parseInt( cfg.cfg_diag_trans ) )

    // debug( "validateCFG: cfg: ", cfg )
    return cfg
}

/* 
WEB CLIENT -> HTTP -> DES ( JOB DB WRITE ) -> MQTT -> DEVICE  
  - Device loggs event to as is memory ( no reponse )
  
WEB CLIENT <- HTTP <- ( JOB DB WRITE ) DES <- MQTT <- DEVICE  
  - Device has encountered an alarm / logged an event
*/
export class Event {
    constructor( 
        evt_time = 0,
        evt_addr = "",
        evt_user_id = "",
        evt_app = client_app,
        evt_code = 0,
        evt_title = "",
        evt_msg = "" 
    ) {
        // this.evt_id = evt_id // Set by DES upon database write
        this.evt_time = evt_time
        this.evt_addr = evt_addr
        this.evt_user_id = evt_user_id
        this.evt_app = evt_app
        this.evt_code = evt_code
        this.evt_title = evt_title
        this.evt_msg = evt_msg
    }
}
Event.prototype.MaxMsg = 512
Event.prototype.MaxTitle = 36

export class EventType {
    constructor(
        evt_typ_code = 0,
        evt_typ_name = "",
        evt_typ_desc = "",
    ) {
        this.evt_typ_code = evt_typ_code
        this.evt_typ_name = evt_typ_name
        this.evt_typ_desc = evt_typ_desc
    }
}
/* 
WEB CLIENT <- HTTP <- ( JOB DB WRITE ) DES <- MQTT <- DEVICE  
  - Device has transmitted a sample
*/
export class Sample {
    constructor ( 
        smp_time = 0,
        smp_ch4 = 0,
        smp_hi_flow = 0,
        smp_lo_flow = 0,
        smp_press = 0,
        smp_bat_amp = 0,
        smp_bat_volt = 0,
        smp_mot_volt = 0,
        smp_vlv_tgt = 2,
        smp_vlv_pos = 2,
        smp_job_name =""
    ) { 
        this.smp_time = smp_time
        this.smp_ch4 = smp_ch4
        this.smp_hi_flow = smp_hi_flow
        this.smp_lo_flow = smp_lo_flow
        this.smp_press = smp_press
        this.smp_bat_amp = smp_bat_amp
        this.smp_bat_volt = smp_bat_volt
        this.smp_mot_volt = smp_mot_volt
        this.smp_vlv_tgt = smp_vlv_tgt
        this.smp_vlv_pos = smp_vlv_pos
        this.smp_job_name =smp_job_name
    }
}
export const ValidateSMP = ( smp ) => {
    let valid = new Sample( )

}

/* 
USED FOR SERVER ASSEMBLED SAMPLE DATA 
*/
export class XYSampleData { 
    constructor(
        xy_smp = {
            ch4: [ new XYPoint( ) ],
            hi_flow: [ new XYPoint( ) ],
            lo_flow: [ new XYPoint( ) ],
            press: [ new XYPoint( ) ],
            bat_amp: [ new XYPoint( ) ],
            bat_volt: [ new XYPoint( ) ],
            mot_volt: [ new XYPoint( ) ],
            vlv_tgt: [ new XYPoint( ) ],
            vlv_pos: [ new XYPoint( ) ],
        }
    ) {
        this.ch4 = xy_smp.ch4
        this.hi_flow = xy_smp.hi_flow
        this.lo_flow = xy_smp.lo_flow
        this.press = xy_smp.press
        this.bat_amp = xy_smp.bat_amp
        this.bat_volt = xy_smp.bat_volt
        this.mot_volt = xy_smp.mot_volt
        this.vlv_tgt = xy_smp.vlv_tgt
        this.vlv_pos = xy_smp.vlv_pos
    }
 }

/* 
WEB CLIENT <- HTTP <- ( JOB DB WRITE ) DES <- MQTT <- DEVICE  
  - Device has transmitted a diagnostic sample
*/
export class DiagSample { /* NOT IMPLEMENTED */
    /* NOT IMPLEMENTED */
}

export class Report {
    constructor(
        rep_id = 0,
        rep_user_id ="",
        rep_created = 0,
        rep_modified = 0,

        rep_title = "",
        rep_secs = [],

        reg = newC001V001_DESRegistration( ),
    ) {
        this.rep_id = rep_id
        this.rep_user_id = rep_user_id
        this.rep_created = rep_created
        this.rep_modified = rep_modified

        this.rep_title = rep_title
        this.rep_secs = rep_secs

        this.reg = reg

        this.selected = false
    }
    
    addSection = ( sec ) => { 
        sec.sec_rep_id = this.rep_id
        /* TODO: VALIDATE */
        rep_secs.push( sec )
        /* TODO: HTTP POST TO DES */
    }

}

export class Section {
    constructor(
        /*  { metadata } */
        sec_id = 0,
        sec_rep_id = 0,
        sec_start = 0,
        sec_end = 0,
        sec_name = "",
        sec_dats = []
    ) {
        this.sec_id = sec_id
        this.rep_id = sec_rep_id
        this.sec_start = sec_start
        this.sec_end = sec_end
        this.sec_name = sec_name
        this.sec_dats = sec_dats
        
        this.selected = false
        this.smp = new Sample( )
        this.cfg = new Config( )
    }
    addSectionDataSet = ( sds ) => {
        sds.sec_id = this.sec_id
        /* TODO: VALIDATE */
        sec_dats.push( sds )
        /* TODO: HTTP POST TO DES */
    }

 }

 export class SectionDataSet {
    constructor(
        /*  { metadata } */
        dat_id,
        dat_sec_id,
        dat_csv = true,
        dat_plot = true,
        dat_y_axis,
        dat_y_min,
        dat_y_max,
    ) {
        this.sds_id = dat_id
        this.sec_id = dat_sec_id
        this.sds_csv = dat_csv
        this.sds_plot = dat_plot
        this.sds_y_axis = dat_y_axis
        this.sds_y_min = dat_y_min
        this.sds_y_max = dat_y_max
    }
}


