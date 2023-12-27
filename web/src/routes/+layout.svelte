
<script>

    import { setContext, onMount } from 'svelte';
    import { goto } from '$app/navigation'

    import { debug } from '../lib/des/utils'
    import { 
        AUTH, UserSession, login, logout, terminateUser,
        USERS, USERS_LOADED, getUserList
    } from '../lib/des/api'

    import { 
		JOBS, JOBS_LOADED, getJobs,
        EVT_TYPES, EVT_TYPES_LOADED, getEventTypes,  
    } from '../lib/c001v001/job'

    import { DEVICES, DEVICES_LOADED, getDevices, disconnectDevices, } from '../lib/c001v001/device'

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
	import { get } from 'svelte/store';

    setContext( 'users', USERS )
    setContext( 'users_loaded', USERS_LOADED )

    setContext( 'evt_types', EVT_TYPES )
    setContext( 'evt_types_loaded', EVT_TYPES_LOADED )

    setContext( 'devices', DEVICES )
    setContext( 'devices_loaded', DEVICES_LOADED )

    setContext( 'jobs', JOBS )
    setContext( 'jobs_loaded', JOBS_LOADED )

   
    onMount( async( ) => {

        if ( sessionStorage.getItem( 'des_auth') && sessionStorage.getItem( 'des_auth') != 'none' ) { 
            AUTH.set( JSON.parse( sessionStorage.getItem( 'des_auth') ) )
            $AUTH.cleanSessionData = cleanUserSession
            await updateUserSession( )
        } 

        /* INCASE WEBSOCKETS WERE OPEN, CLOSE THEM; 
        CAUSES THE SERVER TO UNSUBSCRIBE THIS DEVICE USER'S MQTT CLIENT FROM ALL TOPICS */
        // window.onbeforeunload = async( ) => { } 

        page = window.location.href.split( "/" ).pop( )

    } )

    const cleanUserSession = async( ) => {
        
        debug( "cleanUserSession( ) -> Start: ", get( AUTH ).user.email )

        /* CLEAR LOCAL STORAGE */
        sessionStorage.setItem( 'des_auth', 'none', { path: '/' } )

        /* CLEAR APP STORES */
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
        
        gotoHome( )
        
        debug( "cleanUserSession( ) -> End: ", get( AUTH ).user.email )
    }
    const handleLogin = async( ) => { 
        await login( email, password, cleanUserSession )
        await updateUserSession( )
    }
    const updateUserSession = async( ) => { 
        await getUserList( )
        await getEventTypes( )
        await getDevices( )
        await getJobs( )
    }

    $: page = "";
    let page_name = "HOME"
    let home_btn_image = btn_img_home_aqua
    let device_btn_image = btn_img_gauge_aqua
    let job_btn_image = btn_img_report_aqua
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

    const gotoHome = ( ) => {
        goto( '/' ) 
        page = ''
    }

    const gotoDevice = ( ) => {
        goto( '/device' ) 
        page = 'device'
    }

    const gotoJob = ( ) => {
        goto( '/job' ) 
        page = 'job'
    }

    const gotoDes = ( ) => {
        goto( '/des_admin' ) 
        page = 'des'
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

    <TitleBar bind:page_name bind:auth={ $AUTH } on:logout={ logout } on:login={ loginModal.open }/>
    
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

                { #if $AUTH.user.role == "admin" }
  
                    <div class="flx-col admin">

                        <PillButton 
                            on:click={ async( ) => { await terminateUser( $AUTH.user ) } } 
                            img={ btn_img_cmd_red } 
                            hint={ "If you don't know..." } 
                        />

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
        .admin { flex-direction: row; }
    }

</style>