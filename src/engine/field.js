/* Field: static turf drawing in yards (x 0–120, y 0–53.33). NE end zone at x 0–10. */
(function (FD) {
  'use strict';
  const W = 120, H = 53.33;

  FD.drawField = function (svg) {
    const defs = `
    <defs>
      <filter id="fglow" filterUnits="userSpaceOnUse" x="-20" y="-20" width="160" height="94">
        <feGaussianBlur stdDeviation=".35" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="fsoft" filterUnits="userSpaceOnUse" x="-20" y="-20" width="160" height="94">
        <feGaussianBlur stdDeviation=".18" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="fchalk" filterUnits="userSpaceOnUse" x="-20" y="-20" width="160" height="94">
        <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="3" result="n"/>
        <feDisplacementMap in="SourceGraphic" in2="n" scale=".3" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="fshadow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx=".15" dy=".25" stdDeviation=".25" flood-color="#000" flood-opacity=".55"/>
      </filter>
      <pattern id="pgrid" patternUnits="userSpaceOnUse" width="1" height="1"><path d="M1 0H0V1" fill="none" stroke="rgba(191,224,255,.16)" stroke-width=".04"/></pattern>
      <pattern id="pgrid5" patternUnits="userSpaceOnUse" width="5" height="5"><path d="M5 0H0V5" fill="none" stroke="rgba(191,224,255,.28)" stroke-width=".06"/></pattern>
      <linearGradient id="gturf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>
    </defs>`;
    let stripes = '';
    for (let i = 0; i < 20; i++) stripes += `<rect x="${10 + i * 5}" y="0" width="5.02" height="${H}" class="${i % 2 ? 'st-b' : 'st-a'}"/>`;
    let yd = '', ticks = '', nums = '', arrows = '';
    for (let x = 15; x <= 105; x += 5) yd += `M${x} 0V${H}`;
    for (let x = 11; x < 110; x++) {
      if (x % 5 === 0) continue;
      ticks += `M${x} .3V.97M${x} ${H - 0.97}V${H - 0.3}M${x} 22.9V23.57M${x} 29.76V30.43`;
    }
    for (let n = 10; n <= 90; n += 10) {
      const x = 10 + n, lab = n <= 50 ? n : 100 - n;
      nums += `<text x="${x}" y="44.33">${lab}</text><text x="${x}" y="9" transform="rotate(180 ${x} 9)">${lab}</text>`;
      if (lab !== 50) {
        const d = n < 50 ? -1 : 1, ax = x + d * 2.25;      // arrow points to the nearer goal line
        arrows += `<path d="M${ax} 43.05l${d * 0.75} .45l${-d * 0.75} .45z"/><path d="M${ax} 9.4l${d * 0.75} .45l${-d * 0.75} .45z" transform="translate(0 -1.25)"/>`;
      }
    }
    const goalPost = (x, d) => `<g class="gp"><line x1="${x}" y1="${FD.MID - 3.08}" x2="${x}" y2="${FD.MID + 3.08}"/><line x1="${x}" y1="${FD.MID}" x2="${x + d * 2}" y2="${FD.MID}"/><circle cx="${x + d * 2}" cy="${FD.MID}" r=".35"/></g>`;
    const neEZ = FD.asset('ne_endzone_ko'), nyEZ = FD.asset('nyj_ko'), nfl = FD.asset('nfl');
    svg.innerHTML = defs + `
    <g id="gField">
      <rect x="-30" y="-20" width="180" height="94" class="apron"/>
      <rect x="-4" y="-4" width="128" height="${H + 8}" class="apron2"/>
      <g class="turf">${stripes}<rect x="0" y="0" width="10" height="${H}" class="ez-ne"/><rect x="110" y="0" width="10" height="${H}" class="ez-ny"/><rect x="0" y="0" width="${W}" height="${H}" fill="url(#gturf)"/></g>
      <rect x="-4" y="-4" width="128" height="${H + 8}" class="bpgrid" fill="url(#pgrid)"/>
      <rect x="-4" y="-4" width="128" height="${H + 8}" class="bpgrid" fill="url(#pgrid5)"/>
      <g class="ezart">
        ${neEZ ? `<image href="${neEZ}" x="-17.5" y="-4.86" width="35" height="9.73" transform="translate(5 ${FD.MID}) rotate(-90)"/>` : `<text class="eztext" transform="translate(5 ${FD.MID}) rotate(-90)">PATRIOTS</text>`}
        ${nyEZ ? `<image href="${nyEZ}" x="-15" y="-4.64" width="30" height="9.28" transform="translate(115 ${FD.MID}) rotate(90)"/>` : `<text class="eztext" transform="translate(115 ${FD.MID}) rotate(90)">JETS</text>`}
      </g>
      ${nfl ? `<image class="midlogo" href="${nfl}" x="${60 - 3.8}" y="${FD.MID - 5}" width="7.6" height="10"/>` : ''}
      <g class="fl-line" fill="none">
        <rect x="0" y="0" width="${W}" height="${H}" stroke-width=".3"/>
        <path d="M10 0V${H}M110 0V${H}" stroke-width=".36"/>
        <path d="${yd}" stroke-width=".16"/>
        <path d="${ticks}" stroke-width=".12"/>
        <path d="M12 ${FD.MID}h.7M108 ${FD.MID}h-.7" stroke-width=".18"/>
      </g>
      <g class="fl-num">${nums}${arrows}</g>
      ${goalPost(0, -1)}${goalPost(120, 1)}
    </g>`;
  };
})(window.FD);
