
<script>

    import { redirect } from '@sveltejs/kit'
    import { get } from 'svelte/store'
    import { setContext, onMount, getContext } from 'svelte';
    import { goto } from '$app/navigation'

    import { 
        AUTH, watchJWT, clean_user_session,
        get_user_list, USERS, USERS_LOADED, 
        get_event_types, EVT_TYPES, EVT_TYPES_LOADED,
        get_devices, DEVICES, DEVICES_LOADED,
		get_jobs, JOBS, JOBS_LOADED,
        debug

    } from '../lib/des_api';
    import Header from './Header.svelte'
    import PillButton from '../lib/common/button/PillButton.svelte'
    import btn_img_home from "$lib/images/btn-img-home.svg"
    import btn_img_home_aqua from "$lib/images/btn-img-home-aqua.svg"
    import btn_img_home_orange from "$lib/images/btn-img-home-orange.svg"
    import btn_img_home_green from "$lib/images/btn-img-home-green.svg"

    import btn_img_gauge from "$lib/images/btn-img-gauge.svg"
    import btn_img_gauge_aqua from "$lib/images/btn-img-gauge-aqua.svg"
    import btn_img_gauge_grey from "$lib/images/btn-img-gauge-grey.svg"
    import btn_img_gauge_orange from "$lib/images/btn-img-gauge-orange.svg"
    import btn_img_gauge_green from "$lib/images/btn-img-gauge-green.svg"

    import btn_img_report from "$lib/images/btn-img-report.svg"
    import btn_img_report_aqua from "$lib/images/btn-img-edit-aqua.svg"
    import btn_img_report_grey from "$lib/images/btn-img-edit-grey.svg"
    import btn_img_report_pink from "$lib/images/btn-img-edit-orange.svg"
    import btn_img_report_green from "$lib/images/btn-img-edit-green.svg"

    import btn_img_cmd_purple from "$lib/images/btn-img-cmd-purple.svg"

    setContext( 'users', USERS )
    setContext( 'users_loaded', USERS_LOADED )

    setContext( 'evt_types', EVT_TYPES )
    setContext( 'evt_types_loaded', EVT_TYPES_LOADED )

    setContext( 'devices', DEVICES )
    setContext( 'devices_loaded', DEVICES_LOADED )

    setContext( 'jobs', JOBS )
    setContext( 'jobs_loaded', JOBS_LOADED )

    
    // let jwt = parseJWT( $AUTH.token )
    // let jwtExpiresIn = Math.floor( ( ( jwt.exp * 1000 ) - Date.now( ) ) / 1000 )
   
    onMount( async( ) => {

        if ( sessionStorage.getItem( 'des_auth') != 'none' ) { 
            AUTH.set( JSON.parse( sessionStorage.getItem( 'des_auth') ) )
            watchJWT( goto_home )
        } 

        await get_user_list( )
        await get_event_types( )
        await get_devices( )
        await get_jobs( )


        /* INCASE WEBSOCKETS WERE OPEN, CLOSE THEM; 
        CAUSES THE SERVER TO UNSUBSCRIBE THIS DEVICE USER'S MQTT CLIENT FROM ALL TOPICS */
        // window.onbeforeunload = async( ) => { 
        //     $DEVICES.forEach( async( dev ) => { if ( dev.socket ) { await dev.disconnectWS( ) } } )
        //     // $DEMO_DEVICES.forEach( dev => { dev.disconnectSIM( ) } ) 
        // } 
        page = window.location.href.split( "/" ).pop( )
    } )

    // let intervalID = null
    // const watchJWT = ( ) => { 

    //     if ( $AUTH.logged_in ) {

    //         let jwt = parseJWT( $AUTH.acc_token )
    //         let jwtExpiresIn = Math.floor( jwt.exp * 1000 - Date.now( ) ) 

    //         debug( "JWT access token expires in: ", jwtExpiresIn )

    //         if ( intervalID !== null ) { stopJWT( ) }

    //         intervalID = setInterval( ( ) => { 

    //             let success = refreshJWT( $AUTH.ref_token )
    //             if ( success ) {
    //                 debug( "ACCESS JWT REFRESHED!" )
    //             } else {
    //                 debug( "REFRESH JWT EXPIRED!" )  
    //                 stopJWT( )
    //                 clean_user_session( )
    //                 goto_home( )
    //             }

    //         }, jwtExpiresIn - 2000 )

    //     }
    // }
    // const stopJWT = ( ) => {
    //     clearInterval( intervalID )
    //     intervalID = null
    // }
    // const parseJWT = ( token ) => {

    //     let base64Url = token.split('.')[1]
    //     let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    //     let jwt = decodeURIComponent( window.atob( base64 ).split( '' ).map( c => {
    //         return '%' + ('00' + c.charCodeAt( 0 ).toString( 16 ) ).slice( -2 )
    //     } ).join( '' ) )

    //     return JSON.parse( jwt )

    // }
    // let refreshCount = 2
    // const refreshJWT = ( ref ) => {
    //     return ( refreshCount-- > 0 ? true : false )
    // }

    const handleNewLogin = async( ) => { 
        watchJWT( goto_home )
        await get_user_list( )
        await get_event_types( )
        await get_devices( )
        await get_jobs( )
    }

    $: page = "";
    let page_name = "HOME"
    let home_btn_image = btn_img_home_aqua
    let device_btn_image = btn_img_gauge_aqua
    let job_btn_image = btn_img_report_green
    $: {
        switch ( page ) {
            case '' : { 
                page_name = "HOME"
                home_btn_image = btn_img_home_orange
                device_btn_image = btn_img_gauge_aqua
                job_btn_image = btn_img_report_aqua
                break
            }
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
            case 'des_admin': { 
                page_name = "DES ADMINISTRATION"
                home_btn_image = btn_img_home_aqua
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

    const goto_home = ( ) => {
        goto( '/' ) 
        page = ''
    }

    const goto_device = ( ) => {
        goto( '/device' ) 
        page = 'device'
    }

    const goto_job = ( ) => {
        goto( '/job' ) 
        page = 'job'
    }

    const goto_des = ( ) => {
        goto( '/des_admin' ) 
        page = 'des'
    }

    

</script>

<div class="flx-col main">

    <Header bind:page_name on:logout={ goto_home } on:login={ handleNewLogin }/>
    
    <div class="flx-row layout">

        <div class="flx-col nav">

            { #if $AUTH.logged_in }

                <div class="flx-col ops">
                    <PillButton 
                        on:click={ goto_home } 
                        img={ home_btn_image } 
                        hint={ null } 
                    />
                    <PillButton 
                        on:click={ goto_device } 
                        img={ device_btn_image } 
                        hint={ 'Device list' }  
                    />
                    <PillButton 
                        on:click={ goto_job } 
                        img={ job_btn_image } 
                        hint={ 'Job list' } 
                    />
                </div>

                { #if $AUTH.role == "admin" }
    
                    <div class="flx-col admin">
                        <PillButton 
                            on:click={ goto_des } 
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
    .page {
        padding: 0 1rem;
        height: 100%;
        overflow: hidden;
    }

    /* LAP TOP */
    @media(max-width: 1440px) {
        
    }

    /* TABLET */
    @media(max-width: 1024px) {
        .page { padding: 0; }
    }

    /* MOBILE */
    @media(max-width: 425px) {
        .layout { flex-direction: column; }
        .nav { flex-direction: row; width: 100%; }
        .ops { flex-direction: row; }
    }

</style>