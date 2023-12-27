<script>
    import { UserSignUp } from "../../des/api"

    import InputText from "../../common/input_text/InputText.svelte"
    import InputPW from "../../common/input_pw/InputPW.svelte"

    export let newUser = new UserSignUp( )
    
</script>

<div class="flx-col container">

    <div class="flx-row">
        <div class="flx-row lbl fg-accent">Name:</div>
        <InputText enabled={ true } bind:txt={ newUser.name } place="User name"/>
    </div>

    <div class="flx-row">
        <div class="flx-row lbl fg-accent">Email:</div>
        <InputText enabled={ true } bind:txt={ newUser.email } place="Email address"/>
    </div>

    <div class="flx-row">
        <div class="flx-row lbl fg-accent">Password:</div>
        <InputPW enabled={ true } bind:txt={ newUser.password } auto="new-password" place="Password"/>
    </div>

    <div class="flx-row">
        <div class="flx-row lbl fg-accent">Confirm:</div>
        <InputPW enabled={ true } bind:txt={ newUser.password_confirm } auto="new-password" place="Confirm password"/>
    </div>

</div>

<style>
    .container {
        width: 35em;
        padding: 0 1em;
        gap: 0.75em;
    }
    .lbl {
        max-width: 4.5em;
        font-size: 1rem;
        align-items: center;
        text-align: end;
    }
</style>