
<script>

    import { onMount } from 'svelte';
    import { goto } from '$app/navigation'

    import { AUTH, get_user, get_user_list, get_event_types, DEVICES, DEMO_DEVICES, USERS, EVENT_TYPES } from '../lib/des_api';
    import Header from './Header.svelte'
    import PillButton from '../lib/common/button/PillButton.svelte'
    import btn_img_home from "$lib/images/btn-img-home.svg"
    import btn_img_gauge from "$lib/images/btn-img-gauge.svg"
    import btn_img_report from "$lib/images/btn-img-report.svg"

    onMount( async( ) => {

        if ( sessionStorage.getItem( 'des_token') != 'none' ) { // console.log( "Current des_token: ", token )
            await get_user( ) 
        }

        await get_user_list( )
        await get_event_types( )

        /* INCASE WEBSOCKETS WERE OPEN, CLOSE THEM; 
        CAUSES THE SERVER TO UNSUBSCRIBE THIS DEVICE USER'S MQTT CLIENT FROM ALL TOPICS */
        window.onbeforeunload = ( ) => { 
            $DEVICES.forEach( dev => { dev.disconnectWS( ) } )
            $DEMO_DEVICES.forEach( dev => { dev.disconnectSIM( ) } ) 
        } 
        page = window.location.href.split( "/" ).pop( )
    } )

    // const src = '$lib/space.jpg'

    $: page = "";
    let page_name = "HOME"
    let home_btn_color = 'bg-orange'
    let device_btn_color = 'bg-accent'
    let job_btn_color = 'bg-accent'
    $: {
        switch ( page ) {
            case '' : { 
                page_name = "HOME"
                home_btn_color = 'bg-orange'
                device_btn_color = 'bg-accent'
                job_btn_color = 'bg-accent'
                break
            }
            case 'device': {  
                page_name = "DEVICES"
                home_btn_color = 'bg-accent'
                device_btn_color = 'bg-orange'
                job_btn_color = 'bg-accent'
                break
            }
            case 'job': { 
                page_name = "JOBS"
                home_btn_color = 'bg-accent'
                device_btn_color = 'bg-accent'
                job_btn_color = 'bg-pink'
                break
            }
            default : { 
                page_name = ""
                home_btn_color = 'bg-accent'
                device_btn_color = 'bg-accent'
                job_btn_color = 'bg-accent'
                break
            }
        }
    }



</script>

<div class="flx-col main">

    <Header bind:page_name/>
    
    <div class="flx-row layout">

        <div class="flx-col nav">

            { #if $AUTH.logged_in }

                <div class="flx-col ops">
                    <PillButton 
                        on:click={ ( ) => { goto( '/' ); page = '' } } 
                        cls={ home_btn_color }
                        img={ btn_img_home } 
                        hint={ null } 
                    />
                    <PillButton 
                        on:click={ ( ) => { goto( '/device' ); page = 'device' } } 
                        cls={ device_btn_color }
                        img={ btn_img_gauge } 
                        hint={ 'Device list' }  
                    />
                    <PillButton 
                        on:click={ ( ) => { goto( '/job' ); page = 'job' } } 
                        cls={ job_btn_color }
                        img={ btn_img_report } 
                        hint={ 'Job list' } 
                    />
                </div>

            { /if }

            <!-- { #if $AUTH.role == "admin" }

                <div class="flx-col admin">
                    <PillButton on:click={ ( ) => { goto( '/demo' ) } } cls='bg-purple'  hint={ "If you don't know..." } />
                </div>
                
                <div class="flx-row admin-mobile">
                    <PillButton on:click={ ( ) => { goto( '/demo' ) } } cls='bg-purple'  hint={ null } />
                </div>

            { /if } -->

        </div>

        <div class="flx-col page"><slot></slot></div>

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