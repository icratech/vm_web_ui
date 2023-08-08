<script>
    import PillButton from '$lib/common/button/PillButton.svelte'
    import InputText from '$lib/common/input_text/InputText.svelte'
    import InputPw from '$lib/common/input_pw/InputPW.svelte'
    
    import { onMount } from "svelte";
    import { SERVER, AuthorizedUser, auth_user } from '../lib/des_api'

    $: loggedIn = false
    $: loginButtonText = ( !loggedIn ? 'Login' : 'Logout' )
    $: loginButtonColor = ( !loggedIn ? 'bg-green_a' : 'bg-purple' )
    $: loginButtonFunc = ( !loggedIn ? login : logout ) 
    
    let email = ""
    let password = ""

    onMount( async( ) =>{
        try {
            
            let auth = JSON.parse( window.sessionStorage.getItem( "auth_user" ) )  // console.log(`auth: ${ JSON.stringify( auth, null, 4 ) }`)
            if ( auth.id ) { 
                    auth_user.set( auth )
                    loggedIn = true
            }
        } catch {
            loggedIn = false // console.log(`loggedIn: ${ loggedIn }`)
        } // console.log( JSON.stringify( $auth_user, null, 4 ) )
    } )

    const login = async( ) => { 

        let payload = JSON.stringify( { email, password } )

        let auth_res = await fetch( `${ SERVER }/api/auth/login`, { 
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: payload             
            } 
        )
        let auth = await auth_res.json()

        if ( auth.status === "success" ) { // console.log(`LOGGED IN!\n${ JSON.stringify( auth, null, 4 ) }`)

            let user_res = await fetch( `${ SERVER }/user/me`, { 
                    method: "GET",
                    headers: { 'Authorization': `Bearer ${ auth.token }`}      
                } 
            )
            let usr = await user_res.json() // console.log(`AUTHENTICATED USER DATA!\n${ JSON.stringify( usr, null, 4 ) }`)
            
            auth_user.set( new AuthorizedUser( 
                usr.data.user.id, 
                usr.data.user.name, 
                usr.data.user.email, 
                usr.data.user.role,
                usr.data.user.provider, 
                usr.data.user.created_at, 
                usr.data.user.updated_at  
            ) )
            $auth_user.setToken( auth.token ) // console.log(`AUTHENTICATED USER DATA!\n${ JSON.stringify( $auth_user, null, 4 ) }`)
            document.cookie = `des_token=${ auth.token }`

            window.sessionStorage.setItem( "auth_user", JSON.stringify( $auth_user ) ) 
            let sess = JSON.parse( window.sessionStorage.getItem( "auth_user" ) )  
            console.log(`AUTHENTICATED USER SESSION DATA!\n${ JSON.stringify( sess, null, 4 ) }`)

            loggedIn = true

        } else {
            console.log(`NOT LOGGED IN!\n${ JSON.stringify( auth, null, 4 ) }`)
        }
    }
    const logout = async( ) => {

        let user_res = await fetch( `${ SERVER }/api/auth/logout`, { 
                method: "GET",
                headers: { 'Authorization': `Bearer ${ $auth_user.token }` }, 
                credentials: "include"   
            } 
        )
        let usr = await user_res.json( )
        console.log( `LOGGED OUT!\n${ JSON.stringify( usr, null, 4 ) }` )
        
        auth_user.set( { } )
        // console.log(`LOGGED OUT USER DATA!\n${ JSON.stringify( $auth_user, null, 4 ) }`)
        
        window.sessionStorage.setItem( "auth_user", JSON.stringify( $auth_user ) )
        // let sess = JSON.parse( window.sessionStorage.getItem( "auth_user" ) )
        // console.log(`LOGGED OUT USER SESSION DATA!\n${ JSON.stringify( sess, null, 4 ) }`)
        document.cookie = `des_token=""`
        loggedIn = false
    }

</script>



<div class="flx-col container">

    <div class="flx-row content">  

        <div class="flx-col title-block">
            <div class="flx-row icon-block">
                <h1>V<span class="ent">ENT</span><span class="wat">WAT</span><span class="ch">CH</span><sub class="four">4</sub></h1>
            </div>
            <div class="subtitle">
                <p>Part of the <span class="data-desk">Data</span><span class="two">2</span><span class="data-desk">Desk</span> ecosystem</p>
            </div>
            
        </div>

        <div class="flx-row login">

            { #if loggedIn }
                <h4>{ $auth_user.name }, you are a tolerable person.</h4>
            { :else }
                <InputText 
                    bind:txt={ email }
                    place={ "email" }
                    enabled={ !loggedIn }
                />
                <InputPw
                    bind:txt={ password }
                    place={ "password" }
                    enabled={ !loggedIn }
                />
            { /if }
              
            <div class="button">
                <PillButton 
                    on:click={ loginButtonFunc }
                    bind:cls={ loginButtonColor }
                > { loginButtonText }</PillButton>
            </div>

        </div>

    </div>

</div>

<style>
    .container {
        background-color: var(--light_aa);
        padding: 0.3em 1em;
        justify-content: space-between;
        gap: 0;
    }
    .content {
        padding-left: 1rem;
        justify-content: space-between;
    }
    .title-block {
        min-width: 20rem;
        gap: 0;
    }
    .icon-block {
        padding: 0;
    }

	.ent {
        font-size: 1.8rem;
    }
	.wat {
        font-size: 1.8rem;
        color: var(--light);
    }
    .ch {
        font-size: 1.8rem;
        color: var(--green);
    }
	.four {
		font-size: 0.6em;
        font-weight: 300;
        color: var(--green);
	}

    .subtitle {
        margin-top: -0.3em;
        padding-bottom: 0.75em;
    }
    .data-desk {
        font-style: oblique;
        color: var(--light);
    }
    .two {
        color: var(--green);
    }
    

    .login {
        align-items: center;
        justify-content: flex-end;
    }
    .button {
        min-width: 5em;
        max-width: 5em;
    }
</style>