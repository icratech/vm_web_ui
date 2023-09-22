<script>

    import BarGaugeH from '../../common/bar_gauge/BarGaugeH.svelte'
    import { Sample, Config, COLORS } from '../../des_api'
    import { RGBA, BASE } from "../../common/colors"

    export let smp = new Sample( )
    export let cfg = new Config( )

    let color_code = RGBA(BASE.LIGHT, 0.5)
    $: {
        switch ( cfg.cfg_vlv_pos ) {
            case 0: 
                color_code = RGBA(COLORS.PRESS, 0.7)
                break
            case 2: 
                color_code = RGBA(COLORS.CH4, 0.7)
                break
            case 4: 
                color_code = RGBA(COLORS.HI_FLOW, 0.7)
                break
            case 6: 
                color_code = RGBA(COLORS.LO_FLOW, 0.7)
                break
        }
    }

</script>


<div class="flx-col container">
    <div class="flx-row mode">
        <!-- { #if cfg.cfg_vlv_tgt == 0 } <h4 class="lbl build">BUILD</h4> { /if }
        { #if cfg.cfg_vlv_tgt == 2 } <h4 class="lbl vent">VENT</h4> { /if }
        { #if cfg.cfg_vlv_tgt == 4 } <h3 class="lbl hi-flow">HI FLOW</h3> { /if }
        { #if cfg.cfg_vlv_tgt == 6 } <h4 class="lbl lo-flow">LO FLOW</h4> { /if }  -->
        
        { #if cfg.cfg_vlv_tgt == 0 } <h4 class="lbl" style="background-color: { color_code };">BUILD</h4> { /if }
        { #if cfg.cfg_vlv_tgt == 2 } <h4 class="lbl" style="background-color: { color_code };">VENT</h4> { /if }
        { #if cfg.cfg_vlv_tgt == 4 } <h3 class="lbl" style="background-color: { color_code };">HI FLOW</h3> { /if }
        { #if cfg.cfg_vlv_tgt == 6 } <h4 class="lbl" style="background-color: { color_code };">LO FLOW</h4> { /if } 
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
    /* .build { background-color: var(--orange_a); }
    .vent { background-color: var(--aqua_a); }
    .hi-flow { background-color: var(--green_a); }
    .lo-flow { background-color: var(--yellow_a); } */
</style>