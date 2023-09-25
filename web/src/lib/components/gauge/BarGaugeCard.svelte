<script>

    import BarGaugeH from '../../common/bar_gauge/BarGaugeH.svelte'
    import { Sample, Config, COLORS } from '../../des_api'
    import { RGBA, BASE } from "../../common/colors"

    export let smp = new Sample( )
    export let cfg = new Config( )

    let color_code = RGBA(BASE.LIGHT, 0.6)
    $: {
        switch ( cfg.cfg_vlv_tgt ) {
            case 0: // BUILD
                color_code = RGBA(COLORS.PRESS, 0.7)
                break
            case 2: // VENT
                color_code = RGBA(BASE.AQUA, 0.8)
                break
            case 4: // HI FLOW
            case 6: // LO FLOW
                if ( smp.smp_lo_flow > cfg.cfg_flow_tog ) {
                    color_code = RGBA(COLORS.HI_FLOW, 0.8)
                } else {
                    color_code = RGBA(COLORS.LO_FLOW, 0.8)
                }
                break
            default:
                color_code = RGBA(BASE.LIGHT, 0.6)
        }
    }

</script>


<div class="flx-col container">
    <div class="flx-row mode">
        <h4 class="lbl" style="background-color: { color_code };">
            { #if cfg.cfg_vlv_tgt == 0 } BUILD { /if }
            { #if cfg.cfg_vlv_tgt == 2 } VENT { /if }
            { #if cfg.cfg_vlv_tgt > 3 } FLOW { /if }
        </h4>
    </div>

    <BarGaugeH title="CH4"
        base_color={ COLORS.CH4 }
        bind:num={ smp.smp_ch4 }
        max={ 100 }
        unit={ "%" }
    />
    
    { #if smp.smp_lo_flow < cfg.cfg_flow_tog }
    <BarGaugeH title="L-Flow"
        base_color={ COLORS.LO_FLOW }
        bind:num={ smp.smp_lo_flow }
        max={ 2 }
        unit={ "L/min" }
    />
    { :else }
    <BarGaugeH title="H-Flow"
        base_color={ COLORS.HI_FLOW }
        bind:num={ smp.smp_hi_flow }
        max={ 250 }
        unit={ "L/min" }
    />
    { /if }
    
    <BarGaugeH title="Pressure"
        base_color={ COLORS.PRESS }
        bind:num={ smp.smp_press }
        max={ 7000 }
        unit={ "kPa" }
    />
    
</div>

<style>
    .container {
        justify-content: center;
        padding: 2em 1em;
        border-radius: 0.5em;
        gap: 0;
        height: 100%;
        background-color: var(--light_aa);
        border-bottom: solid 0.05em var(--light_01);
        border-right: solid 0.05em var(--light_01);
    }
    .mode {
        margin-top: -0.5em;
        padding-bottom: 1em;
    }
    .lbl { color: var(--dark); padding: 0 1em; border-radius: 1em; font-size: 1.3em; font-weight: 400;}
</style>