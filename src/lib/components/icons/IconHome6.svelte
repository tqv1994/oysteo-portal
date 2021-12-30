<script>
    let className = undefined;
    export { className as class };
    export let id = undefined;
    export let tabindex = undefined;
    export let focusable = false;
    export let title = undefined;
    export let style = undefined;
    export let width = "24";
    export let height = "24";
  
    $: ariaLabel = $$props['aria-label'];
    $: ariaLabelledBy = $$props['aria-labelledby'];
    $: labelled = ariaLabel || ariaLabelledBy || title;
    $: attributes = {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-hidden': labelled ? undefined : true,
      role: labelled ? 'img' : undefined,
      focusable: tabindex === '0' ? true : focusable,
      tabindex
    };
  </script>
  
  <!-- svelte-ignore a11y-mouse-events-have-key-events -->
  <svg
    data-carbon-icon="IconHome1"
    on:click
    on:mouseover
    on:mouseenter
    on:mouseleave
    on:keyup
    on:keydown
    xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${width} ${height}`} fill="currentColor" width={width} height={height}
    class={className}
    preserveAspectRatio="xMidYMid meet"
    {style}
    {id}
    {...attributes}
    >
    <g id="Group_11195" data-name="Group 11195" transform="translate(12013.001 15171)">
        <path id="Path_10733" data-name="Path 10733" d="M1098.752-2211.771a9.774,9.774,0,0,0-4.092,2.409,10.77,10.77,0,0,0-1.5,2.305l-.665,1.392v70.409l.665,1.392a10.729,10.729,0,0,0,1.516,2.326,9.47,9.47,0,0,0,4.86,2.513l1.122.145.145,1.122a9.466,9.466,0,0,0,2.513,4.86,10.7,10.7,0,0,0,2.326,1.516l1.392.665h53.793l1.392-.665a7.982,7.982,0,0,0,4.071-3.967l.768-1.578.062-29.6.042-29.6-12.919-12.94L1141.309-2212l-20.873.021C1108.68-2211.958,1099.209-2211.875,1098.752-2211.771Zm43.6,5.587,2.471,2.471-18.984.062-19,.062-1.2.561a9.525,9.525,0,0,0-4.154,4.092l-.665,1.371-.062,32.65c-.042,31.341-.062,32.67-.415,32.67a5.234,5.234,0,0,1-3.116-1.516c-1.62-1.641-1.5,1.288-1.5-36.679,0-38.03-.125-35.143,1.516-36.742,1.579-1.558.228-1.475,22.577-1.475l20.042-.021Zm4.881,13.6v7.81l.519.5.5.519h15.6v27.811c0,31.072.1,28.849-1.5,30.49-1.578,1.62.332,1.516-28.434,1.516-28.7,0-26.731.1-28.371-1.5-1.641-1.62-1.537,1.309-1.475-37.032.062-32.982.083-34.291.457-35a5.32,5.32,0,0,1,3.24-2.721c.291-.083,9.284-.166,20-.166l19.461-.021Zm8.827.1,5.4,5.4h-10.9v-5.4c0-2.97.021-5.4.062-5.4C1150.634-2197.877,1153.085-2195.446,1156.055-2192.476Z" transform="translate(-13105.5 -12959)"/>
        <path id="Path_10734" data-name="Path 10734" d="M1196.519-2043.481a1.62,1.62,0,0,0-.519,1.143,1.62,1.62,0,0,0,.519,1.142l.5.519h37.843l.5-.519a1.619,1.619,0,0,0,.519-1.142,1.62,1.62,0,0,0-.519-1.143l-.5-.519h-37.843Z" transform="translate(-13187.504 -13092.106)"/>
        <path id="Path_10735" data-name="Path 10735" d="M1196.519-1995.481a1.619,1.619,0,0,0-.519,1.142,1.62,1.62,0,0,0,.519,1.143l.5.519h37.843l.5-.519a1.62,1.62,0,0,0,.519-1.143,1.619,1.619,0,0,0-.519-1.142l-.5-.519h-37.843Z" transform="translate(-13187.504 -13130.139)"/>
        <path id="Path_10736" data-name="Path 10736" d="M1196.519-1947.481a1.619,1.619,0,0,0-.519,1.142,1.62,1.62,0,0,0,.519,1.142l.5.519h37.843l.5-.519a1.619,1.619,0,0,0,.519-1.142,1.619,1.619,0,0,0-.519-1.142l-.5-.519h-37.843Z" transform="translate(-13187.504 -13168.168)"/>
        <path id="Path_10737" data-name="Path 10737" d="M1196.519-1899.481a1.619,1.619,0,0,0-.519,1.142,1.619,1.619,0,0,0,.519,1.142l.5.519h37.843l.5-.519a1.619,1.619,0,0,0,.519-1.142,1.619,1.619,0,0,0-.519-1.142l-.5-.519h-37.843Z" transform="translate(-13187.504 -13206.198)"/>
      </g>
    <slot>
      {#if title}
        <title>{title}</title>
      {/if}
    </slot>
  </svg>
  