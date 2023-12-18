<script>

    import { AUTH } from '../lib/des_api'
    import PillButton from '../lib/common/button/PillButton.svelte'
    import vent_medic_logo from "$lib/images/vent-medic-hdr-logo.svg"
    
    import btn_img_login_purple from "$lib/images/btn-img-login-purple.svg"
    import btn_img_logout_purple from "$lib/images/btn-img-logout-purple.svg"

	import { createEventDispatcher } from 'svelte'
	const dispatch = createEventDispatcher()

    $: loginButtonImage = ( $AUTH && $AUTH.logged_in ? btn_img_logout_purple : btn_img_login_purple )
    $: loginButtonFunc = ( $AUTH && $AUTH.logged_in ? async( ) => { dispatch( 'logout' ) } : async( ) => { dispatch( 'login' ) } )

    export let page_name = "PAGE_NAME"

</script>


<div class="flx-col container">

    <div class="flx-row content">  

        <div class="flx-row"> 

            <div class="flx-col title-block">
                <div class="flx-col logo" style="background-image: url( { vent_medic_logo } );"></div>
                <div class="subtitle">
                    <p>Part of the <span class="data-desk">Data</span><span class="two">2</span><span class="data-desk">Desk</span> ecosystem</p>
                </div>
            </div>

            <div class="flx-row page-block">
                <h3>{ page_name }</h3>
            </div>

            <div class="flx-row login-btn">        
                <div class="flx-row login-msg">{ ( $AUTH && $AUTH.logged_in ? $AUTH.name : 'Login' ) }</div>
                <PillButton 
                    img={ loginButtonImage }
                    on:click={ loginButtonFunc }
                    hint={ null } 
                />
            </div>
            
        </div>


    </div>   

</div>


<style>
    .container {
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        padding: 1em;
        gap: 0.5em;
    }
    .content {
        flex-direction: row;
        justify-content: space-between;
    }


    /* LOGO AND SUCH */
    .title-block { min-width: 19em; width: auto; gap: 0; }
    .logo {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: left;
        height: 3.8em;
    }
    .subtitle { margin-top: -0.85em; margin-left: 3.8em; }
    .data-desk { font-style: oblique; color: var(--light); }
    .two { color: var(--green);  }
        
    .page-block { 
        color: var(--orange_a); 
        justify-content: center;
        align-items: center; 
        min-width: 12em;
        width: 100%; 
    }

    .login-btn {
        justify-content: flex-end;
        align-items: center;
        width: auto;
        gap: 0.5em;
    }
    .login-msg {
        justify-content: flex-end;
        min-width: 3.5em;
        font-size: 1.2em;
    }
    
    /* LAP TOP */
    @media(max-width: 1440px) {
        .container { background-color: transparent; }
        .logo { 
            margin-top: 0.5em; 
            height: 3em;
        }
        .subtitle { 
            padding-bottom: 0.25em;
            margin-left: 3em;
        }
    }

    /* TABLET */
    @media(max-width: 1024px) {

    }

    /* MOBILE */
    @media(max-width:425px) {

        .content {
            flex-direction: column;
            padding-bottom: 0.5em;
            gap: 0;
        }

        .page-block { display: none; }

        .login-btn {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: 100%;
            gap: 1em;
        }

    }
</style>