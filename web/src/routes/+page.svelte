<script>

    import Modal from "../lib/common/modal/Modal.svelte"
    import PillButton from "../lib/common/button/PillButton.svelte"
    import vent_medic_logo from "$lib/images/vent-medic-logo.svg"
    import vent_medic_ship from "$lib/images/vent-medic-ship.webp"
    import vent_medic_deployed from "$lib/images/vent-medic-deployed.webp"

    import UserRegistration from "./UserRegistration.svelte"
    import { UserSignUp, sign_up_user } from "../lib/des_api"
    let newUser = new UserSignUp( )
    let modal

    let validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    $: nameLength = ( newUser.name.length >= 3 )
    $: validEmail = ( newUser.email.match( validEmailRegex ) ) 
    $: pwLength = ( newUser.password.length >= 8 )
    $: pwMatch = ( newUser.password !== "" && newUser.password == newUser.password_confirm )

    $: valid = ( nameLength && validEmail && pwLength && pwMatch ) 
</script>

<div class="flx-col container" >

    <div class="flx-col welcome">
        <div class="flx-col logo" style="background-image: url( { vent_medic_logo } );"></div>
    
        <Modal bind:this={ modal } bind:valid on:confirm={ async( ) => { sign_up_user( newUser ) } }>
            <h3 class='fg-accent' slot="title">Sign-Up</h3>
            <div slot="content" class="flx-row">
                <UserRegistration bind:newUser />
            </div>
            <div slot="footer" class="flx-col">
                { #if valid }   
                <p class="alert valid">Send sign-up request</p>
                { :else }
                    <div class="flx-col validation">
                        { #if !nameLength }
                            <p class="alert invalid">Name must be 3 or more characthers.</p>
                        { /if }
                        { #if !validEmail }
                            <p class="alert invalid">Email must be a valid email address.</p>
                        { /if }
                        { #if !pwLength }
                            <p class="alert invalid">Password must be 8 or more charachters.</p>
                        { /if }
                        { #if !pwMatch }
                            <p class="alert invalid">Password and confirmation must match.</p> 
                        { /if }
                    </div>
                { /if }
            </div>
        </Modal>

        <div class="flx-row banner deployed" style="background-image: url( { vent_medic_deployed} );"></div>
        <div class="flx-row banner ship" style="background-image: url( { vent_medic_ship} );"></div>

        <div class="flx-row actions">

            Sign-Up
            <PillButton 
                on:click={ async( ) => { modal.open( ) } }
                cls='bg-accent' 
                hint={ null }
            />
            <!-- <br>
            <div class='alert'>Or</div>
            <br>
            <PillButton 
                on:click={ async( ) => { modal.open( ) } }
                cls='bg-accent' 
                hint={ null }
            />
            <div class='alert'>Sign-Up</div> -->

        </div>

    </div>

</div>


<style>

    .container {
        height: 100%;
        gap: 1rem;
        overflow-y: hidden;
        align-items: center;
        justify-content: flex-start;
    }

    .welcome {
        justify-content: space-between;
        align-items: center;
    }

    .logo {
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        margin-bottom: -1em;
        height: 10em;
        z-index: 1;
    }

    .banner {
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        justify-content: center;
        height: 50em;
        opacity: .9;
    }
    .banner.deployed { display: flex; }
    .banner.ship { 
        display: none; 
        height: 29em;
    }

    .actions {
        font-size: 1.2em;
        font-style: oblique;
        align-items: center;
        justify-content: center;
        gap: 0.5em
    }

    .validation {
        align-items: flex-start;
        justify-content: center;
        gap: 0.5em;
        padding-left: 5em;
    }
    .alert {
        font-size: 1.2em;
        font-style: oblique;
    }
    .alert.valid {
        color: var(--green_a);
        text-align: right;
    }
    .alert.invalid {
        color: var(--orange);
    }

    @media(max-width: 425px) {
        .container {
            overflow-y: auto;
        }
        .banner.deployed {
            display: none;
        }
        .banner.ship {
            display: flex;
        }
        .logo {
            height: 6.5em;
            margin-top: 2em;
        }
    }

</style>
