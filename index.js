const currentResentVersion = 510;
const currentResentStoreVersion = 501;

window.eaglercraftXOpts = {
  allowUpdateSvc: false,
  allowUpdateDL: false,
  allowFNAWSkins: false,
  allowBootMenu: false,
  allowServerRedirects: false,
  checkRelaysForUpdates: false,
  enableMinceraft: false,
  container: 'game_frame',
  servers: [
    {
      addr: 'wss://play.webmc.fun',
      name: '§b§lWebMC§r',
      hideAddr: true
    },
    {
      addr: 'java://java.webmc.fun',
      name: '§b§lWebMC§r §8[JAVA]§r',
      hideAddr: true
    }
  ],
  assetsURI: [ { url: 'game/assets.epw' } ],
  hooks: {
    localStorageSaved: async (k, d) => {
      if (k === 's') {
        await s();
      }
    },
  },
  optionsTXT: {
    // fov: '0.25',
    enableFNAWSkins: false,
    snooperEnabled: false
  }
}

window.ResentLoadScreen = {
  createLoadScreen: () => {},
  changeToDecompressingAssets: () => {},
  setMaxDecompressSteps: (a) => {},
  setDecompressStep: (a) => {},
  decompressProgressUpdate: (a) => {},
  showInteractScreen: () => {},
  showInteractScreenWithCallback: (a) => {},
  showFinalScreen: () => {},
  destroyLoadScreen: () => {},
  hasInteracted: () => { return false; },
  hasDestroyed: () => { return true; }
}

window.open = new Proxy(window.open, {
  apply (a, b, c) {
    let url = c[0].trim();
    if (url === 'https://lax1dude.net/eaglerxserver') {
      url = 'https://github.com/lax1dude/eaglerxserver/releases/latest/download/EaglerXServer.jar';
    }
    if (url !== c[0]) {
      c[0] = url;
    }
    return Reflect.apply(a, b, c);
  }
});

async function start () {
  const ver = await gzipC(JSON.stringify({ 'lastUpdated': Date.now(), 'integer': currentResentVersion }));
  localStorage.setItem('_eaglercraftX.ResentLatestBuild', ver);
  let g = localStorage.getItem('_eaglercraftX.g');
  g = g ? await gzipD(g) : '';
  for (const k in window.eaglercraftXOpts.optionsTXT) {
    const r = new RegExp(`^${k}:.*$`, 'm');
    if (r.test(g)) {
      g = g.replace(r, `${k}:${g[k]}`);
    } else {
      g += (g.endsWith('\n') || g.length === 0 ? '' : '\n') + `${k}:${window.eaglercraftXOpts.optionsTXT[k]}\n`;
    }
  }
  localStorage.setItem('_eaglercraftX.g', await gzipC(g));
  await s();
  main();
}

async function s() {
  await writeServers(['_eaglercraftX.s']);
}

async function gzipC (txt) {
  const stream = new CompressionStream('gzip');
  const writer = stream.writable.getWriter();
  writer.write(new TextEncoder().encode(txt));
  writer.close();
  const verBuf = await new Response(stream.readable).arrayBuffer();
  const bytes = new Uint8Array(verBuf);
  let ret = '';
  for (let i = 0; i < bytes.length; i++) {
    ret += String.fromCharCode(bytes[i]);
  }
  return btoa(ret);
}

async function gzipD (txt) {
  const bin = atob(txt);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  const stream = new DecompressionStream('gzip');
  const writer = stream.writable.getWriter();
  writer.write(bytes);
  writer.close();
  const ret = await new Response(stream.readable).arrayBuffer();
  return new TextDecoder().decode(ret);
}