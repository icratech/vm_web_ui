
<script>
    
    import { page } from '$app/stores'
    import { goto } from '$app/navigation'
    import { get } from 'svelte/store'
    import { setContext, onMount, onDestroy } from 'svelte'

    import { ALERT_CODES, alert, waitMilli, debug } from '../lib/des/utils'
    import { 
        AUTH, RoleCheck, UserSession, login, logout, terminateUser, refreshJWT,
        API_URL_USER_WS, wsConnectionAuth, updateUserSession, WS_LIVE_LIMIT,
        USERS, USERS_LOADED, getUserList
    } from '../lib/des/api'

    import { 
		JOBS, JOBS_LOADED, getJobs, updateJobsStore,
        EVT_TYPES, EVT_TYPES_LOADED, getEventTypes,  
		DES_JOBS, DES_JOBS_LOADED, getDESJobs,
    } from '../lib/c001v001/job'

    import { DEVICES, DEVICES_LOADED, getDevices, disconnectDevices, updateDevicesStore } from '../lib/c001v001/device'

    import TitleBar from '../lib/des/components/TitleBar.svelte'
    import PillButton from '../lib/common/button/PillButton.svelte'
    import AlertModal from '../lib/common/modal/AlertModal.svelte'
    import LoginModal from '../lib/common/modal/LoginModal.svelte'

    import btn_img_home_aqua from "$lib/images/btn-img-home-aqua.svg"
    import btn_img_home_orange from "$lib/images/btn-img-home-orange.svg"

    import btn_img_gauge_aqua from "$lib/images/btn-img-gauge-aqua.svg"
    import btn_img_gauge_orange from "$lib/images/btn-img-gauge-orange.svg"

    import btn_img_report_aqua from "$lib/images/btn-img-edit-aqua.svg"
    import btn_img_report_pink from "$lib/images/btn-img-edit-orange.svg"

    import btn_img_cmd_purple from "$lib/images/btn-img-cmd-purple.svg"
    import btn_img_cmd_red from "$lib/images/btn-img-cmd-red.svg"

    const role = new RoleCheck( )

    setContext( 'users', USERS )
    setContext( 'users_loaded', USERS_LOADED )

    setContext( 'evt_types', EVT_TYPES )
    setContext( 'evt_types_loaded', EVT_TYPES_LOADED )

    setContext( 'devices', DEVICES )
    setContext( 'devices_loaded', DEVICES_LOADED )

    setContext( 'jobs', JOBS )
    setContext( 'jobs_loaded', JOBS_LOADED )

    setContext( 'des_jobs', DES_JOBS )
    setContext( 'des_jobs_loaded', DES_JOBS_LOADED )
   
    $: sideNav = true
    onMount( async( ) => {

        page_url_name = window.location.href.split( "/" )[3]
        sideNav = ( window.matchMedia( "( max-width: 550px )" ) ? false : true ) 
        checkPage( )

        if ( sessionStorage.getItem( 'des_auth') && sessionStorage.getItem( 'des_auth') != 'none' ) { 
            AUTH.set( JSON.parse( sessionStorage.getItem( 'des_auth') ) )
            $AUTH.cleanSessionData = cleanSessionData
            await updateSessionData( )
        } 

        if ( $AUTH && $AUTH.logged_in ) {
            await connectWS( )
        }

        /* INCASE WEBSOCKETS WERE OPEN, CLOSE THEM; 
        CAUSES THE SERVER TO UNSUBSCRIBE THIS DEVICE USER'S MQTT CLIENT FROM ALL TOPICS */
        window.onclose = async( ) => { 
            if ( $AUTH && $AUTH.socket ) {
                await disconnectWS( )
            }
            return undefined
        } 

    } )

    $: sec = 0
    let intervalID = setInterval( ( ) => {
        checkPage( )
        updateDevicesStore( )
        updateJobsStore( )
        updateUserSession( )
        if ( $AUTH && $AUTH.logged_in ) {
            let now = Date.now()
            sec = WS_LIVE_LIMIT /1000 - Math.floor( ( now - $AUTH.ping.time ) / 1000 )
            if ( sec < 0 ) { 
                sec = 0
                $AUTH.ping.ok = false
            }
            if ( $AUTH.ping.ok ) refreshJWT( )
        }
    }, 500 )
    onDestroy( ( ) => { 
        clearInterval( intervalID )
        intervalID = null
    } )

    const cleanSessionData = async( ) => {
        
        debug( "cleanSessionData( ) -> Start: ", get( AUTH ).user.email )

        /* CLEAR LOCAL STORAGE */
        sessionStorage.setItem( 'des_auth', 'none', { path: '/' } )

        /* CLEAR APP STORES */
        await disconnectWS( )
        AUTH.set( new UserSession( ) ) 

        USERS.set( [ ] )
        USERS_LOADED.set( false )

        EVT_TYPES.set( [ ] )
        EVT_TYPES_LOADED.set( false )

        /* DISCONNECT ALL DEVICE WS ON LOGOUT */
        await disconnectDevices( )
        DEVICES.set( [ ] )
        DEVICES_LOADED.set( false )

        /* DISCONNECT ALL JOB WS ON LOGOUT */
        // await disconnect_jobs( ) // TODO: 
        JOBS.set( [ ] )
        JOBS_LOADED.set( false )
        
        DES_JOBS.set( [ ] )
        DES_JOBS_LOADED.set( false )
        
        gotoHome( )
        
        debug( "cleanSessionData( ) -> End: ", get( AUTH ).user.email )
    }
    const handleLogin = async( ) => { 
        await login( email, password, cleanSessionData )
        if ( $AUTH && $AUTH.logged_in ) {
            await updateSessionData( )
            await connectWS( )
        }
    }
    const updateSessionData = async( ) => { 
        debug( "+layoute.svelte -> updateSessionData( ) -> $AUTH.user.role: ", $AUTH.user.role )

        if ( role.isViewer( $AUTH.user.role ) ) {
            await getUserList( )
            await getEventTypes( )
            await getDevices( )
            await getJobs( )
        }
        
        if ( role.isSuper( $AUTH.user.role ) ) await getDESJobs( )
    }
    
    /* WEBSOCKET METHODS **************************************************************/
    let disconnectWS = async( ) => { }
    const connectWS = async( ) => {
        let res = await wsConnectionAuth( API_URL_USER_WS, "user_session", $AUTH )
        if ( res.err !== null ) 
            alert( ALERT_CODES.ERROR, `WebSocket connection failed:  ${ res.err }` )
        else {
            res.ws.onopen = ( e ) => {  
                $AUTH.socket = true
                $AUTH.ping.ok = true
                $AUTH.ping.time = Date.now()
                debug( `+layout.svelte -> connectWS( ) -> ${ $AUTH.user.email } -> WebSocket OPEN` ) 
            }
            res.ws.onerror = ( e ) => { 
                res.ws.close( )
                $AUTH.socket = false
                // debug( `+layout.svelte -> ${ $AUTH.user.email } -> ws.onerror ERROR: ${ JSON.stringify( e )  }\n` ) 
            }
            res.ws.onmessage = async( e ) => {

                let msg = JSON.parse( JSON.parse( e.data ) )
                switch ( msg.type ) { 

                    case "err":
                        debug( "new err message received from DES: ", msg.data ) 
                        if ( $AUTH.logged_in ) { logout( ) }
                        break

                    case "live": 
                        $AUTH.ping.ok = true
                        $AUTH.ping.time = Date.now()
                        // debug( "new keep alive message received from DES: ", msg.data ) 
                        break

                    default: 
                        debug( `+layout.svelte -> ${ $AUTH.user.email } -> ONMESSAGE: Type unknown: ${ e.data }\n` )
                        break
                }
            }
            disconnectWS = async( ) => {
                if ( res.ws && res.ws.readyState !== WebSocket.CLOSED && res.ws.readyState !== WebSocket.CLOSING ) {
                    res.ws.send( "close" )
                    res.ws.close( ) 
                }
                $AUTH.socket = false
                $AUTH.ping.ok = false
                $AUTH.ping.time = 0
                debug( `+layout.svelte -> disconnectWS( ) -> WebSocket CLOSED` ) 
            }
            await waitMilli(1000)
        }
    }

    $: page_url_name = "";
    $: page_name = ""
    $: home_btn_image = btn_img_home_aqua
    $: device_btn_image = btn_img_gauge_aqua
    $: job_btn_image = btn_img_report_aqua
    const checkPage = ( ) => {
        switch ( page_url_name ) {
            case 'device': {  
                page_name = "DEVICES"
                home_btn_image = btn_img_home_aqua
                device_btn_image = btn_img_gauge_orange
                job_btn_image = btn_img_report_aqua
                break
            }
            case 'job': { 
                page_name = "JOBS"
                home_btn_image = btn_img_home_aqua
                device_btn_image = btn_img_gauge_aqua
                job_btn_image = btn_img_report_pink
                break
            }
            case 'desadmin': { 
                page_name = "DES ADMINISTRATION"
                home_btn_image = btn_img_home_aqua
                device_btn_image = btn_img_gauge_aqua
                job_btn_image = btn_img_report_aqua
                break
            }
            case '' : { 
                page_name = "HOME"
                home_btn_image = btn_img_home_orange
                device_btn_image = btn_img_gauge_aqua
                job_btn_image = btn_img_report_aqua
                break
            }
            default : { 
                page_name = ""
                home_btn_image = btn_img_home_aqua
                device_btn_image = btn_img_gauge_aqua
                job_btn_image = btn_img_report_aqua
                break
            }
        }
    }

    const gotoHome = async( ) => {
        page_url_name = ''
        await goto( '/' ) 
    }

    const gotoDevice = async( ) => {
        page_url_name = 'device'
        await goto( '/device' ) 
    }

    const gotoJob = async( ) => {
        page_url_name = 'job'
        await goto( '/job' ) 
    }

    const gotoDes = async( ) => {
        page_url_name = 'desadmin'
        await goto( '/desadmin' ) 
    }

    let email = ""
    let password = ""

    /* USED TO EXPOSE THE MODALS' OPEN( ) METHOD 
    SO IT CAN BE CALLED FROM OTHER COMPONENTS */
    let loginModal

</script>

<div class="flx-col main">

    <AlertModal />

    <LoginModal bind:this={ loginModal } bind:email bind:password on:confirm={ handleLogin }/>

    <TitleBar bind:page_name bind:auth={ $AUTH } bind:sec on:logout={ logout } on:login={ loginModal.open }/>
    
    <div class="flx-row layout">

        <div class="flx-col nav">

            { #if $AUTH && $AUTH.logged_in }

                <div class="flx-col ops">
                    <PillButton 
                        on:click={ gotoHome } 
                        img={ home_btn_image } 
                        hint={ null } 
                    />

                    <PillButton 
                        on:click={ gotoDevice } 
                        img={ device_btn_image } 
                        hint={ 'Device list' }  
                    />

                    <PillButton 
                        on:click={ gotoJob } 
                        img={ job_btn_image } 
                        hint={ 'Job list' } 
                    />
                </div>

                { #if role.isAdmin( $AUTH.user.role ) }
  
                    <div class="flx-col admin">

                        <!-- <PillButton 
                            on:click={ async( ) => { await terminateUser( $AUTH.user ) } } 
                            img={ btn_img_cmd_red } 
                            hint={ "If you don't know..." } 
                        /> -->

                        <PillButton 
                            on:click={ gotoDes } 
                            img={ btn_img_cmd_purple } 
                            hint={ "If you don't know..." } 
                        />
                    </div>
    
                { /if }

            { /if }

        </div>

        <div class="flx-col page"><slot /></div>

    </div>

</div>
<style>
    .main {
        background-image: url( "$lib/images/bg-img-blue.svg" );
        -webkit-background-size: cover;
        -moz-background-size: cover;
        -o-background-size: cover;
        background-size: cover;
        color: var(--grey);
        height: 100vh;
    }
    .layout {
        overflow: hidden;
        height: 100%;
        padding-bottom: 1em;
    }
    .nav {
        justify-content: space-between;
        padding: 0.5em 1em;
        width: 3.8em;
    }
    .admin { justify-content: flex-end; }
    .page {
        padding: 0 1rem;
        height: 100%;
        overflow: hidden;
    }

    
    /* LAP TOP */
    @media(max-width: 1500px) {
        .page { 
            padding-left: 0; 
            padding-right: 0.5em; 
        }
    }

    /* TABLET */
    @media(max-width: 1100px) {
        /* .page { padding: 0; } */
    }

    /* MOBILE */
    @media(max-width: 450px) {
        .layout { flex-direction: column; }
        .nav { flex-direction: row; width: 100%; }
        .ops { flex-direction: row; }
        .admin { flex-direction: row; }
    }

</style>