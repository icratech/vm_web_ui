<script>

    import { goto } from '$app/navigation'

    import { AUTH, login, logout } from '../lib/des_api'
    import PillButton from '../lib/common/button/PillButton.svelte'
    import vent_medic_logo from "$lib/images/vent-medic-hdr-logo.svg"

    let email = ""
    let password = ""
    $: loginButtonColor = ( $AUTH.logged_in ? 'bg-purple' : 'bg-accent' )
    $: loginButtonText = ( $AUTH.logged_in ? 'out' : 'in' )
    $: loginButtonFunc = ( $AUTH.logged_in ? ( ) => { logout( ); goto( '/' ) } : ( ) => { login( email, password ) } )

</script>



<div class="flx-col container">

    <div class="flx-row { ( $AUTH.logged_in ? 'content-in' : 'content' ) }">  

        <div class="flx-col title-block">
            <div class="flx-col logo" style="background-image: url( { vent_medic_logo } );"></div>
            <div class="subtitle">
                <p>Part of the <span class="data-desk">Data</span><span class="two">2</span><span class="data-desk">Desk</span> ecosystem</p>
            </div>
            
        </div>

        <div class="flx-row login">
        
            { #if $AUTH.logged_in }
            <h4 id="auth">{ $AUTH.name }, you are a tolerable person.</h4>
            { :else }
            <div class="flx-col input-container">
                <label class="lbl">
                    email
                    <input name="email"  type="email" bind:value={ email } id="usr"/>
                </label>
            </div>
            
            <div class="flx-col input-container">
                <label class="lbl">
                    password
                    <input name="password" type="password"  bind:value={ password } id="pw" autocomplete="new-password"/>
                </label>
            </div>
            { /if }
            <div class="login-btn">
                
                <div class="mob-msg">{ ( $AUTH.logged_in ? $AUTH.name : 'Sign-In' ) }</div>
               
                <PillButton 
                    cls={ loginButtonColor }
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
        padding-left: 1em;
        padding-right: 1em;
        justify-content: space-between;
        gap: 0;
    }
    .content {
        flex-direction: row;
        justify-content: space-between;
    }
    .title-block {
        min-width: 20rem;
        gap: 0;
    }

    .logo {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: left;
        margin-top: 1em;
        height: 3.8em;
        width: 100%;
    }

    .subtitle {
        margin-top: -0.85em;
        margin-left: 3.8em;
        padding-bottom: 0.75em;
    }
    .data-desk {
        font-style: oblique;
        color: var(--light);
    }
    .two {
        color: var(--accent);
    }
    

    .login {
        justify-content: flex-end;
        align-items: flex-end;
        padding-bottom: 1em;
    }

    .input-container {
        gap: 0.25rem;
        width: 17em;
    }

    .lbl {
        font-size: 0.9rem;
    }

    input {
        color: var(--light);
        background-color: var(--light_aa);
        padding: 0.5rem;
        border-radius: 0.5rem;
        border-right: solid 0.05em var(--light_01);
        border-bottom: solid 0.05em var(--light_01);
        width: 100%;
    }

    .login-btn {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: auto;
            gap: 1em;
        }
    .mob-msg {
        display: none;
    }

    @media(max-width:1080px) {
        .container {
            background-color: transparent;
            border-bottom: none;
        }
        .content {
            flex-direction: column;
        }
        .logo { margin-top: 0.5em; }
        .subtitle { padding-bottom: 0; }
        .login {
            flex-direction:column;
            justify-content: center;
            /* align-items: center; */
            padding: 0;
            gap:0.5em;
        }
        .input-container {
            width: 100%;
        }
        .login-btn {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            width: 100%;
            gap: 1em;
        }
        .mob-msg {
            display: block;
            font-size: 1.2em;
        }

        #auth {
            display: none;
        }
    }
</style>