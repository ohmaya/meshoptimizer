// This file is part of meshoptimizer library and is distributed under the terms of MIT License.
// Copyright (C) 2016-2019, by Arseny Kapoulkine (arseny.kapoulkine@gmail.com)
var MeshoptDecoder = (function() {
	"use strict";
	var wasm_base = "AGFzbQEAAAABIwZgAX8AYAAAYAV/f39/fwF/YAN/f38Bf2ABfwF/YAN/f38AAicBA2Vudh9lbXNjcmlwdGVuX25vdGlmeV9tZW1vcnlfZ3Jvd3RoAAADCQgDAQQEBQACAgUDAQABBggBfwFBkMwBCwdTBQZtZW1vcnkCABptZXNob3B0X2RlY29kZVZlcnRleEJ1ZmZlcgAIGW1lc2hvcHRfZGVjb2RlSW5kZXhCdWZmZXIABwZfc3RhcnQAAgRzYnJrAAMKwiQIggQBA38gAkGAwABPBEAgACABIAIQBSAADwsgACACaiEDAkAgACABc0EDcUUEQAJAIAJBAUgEQCAAIQIMAQsgAEEDcUUEQCAAIQIMAQsgACECA0AgAiABLQAAOgAAIAFBAWohASACQQFqIgIgA08NASACQQNxDQALCwJAIANBfHEiBEHAAEkNACACIARBQGoiBUsNAANAIAIgASgCADYCACACIAEoAgQ2AgQgAiABKAIINgIIIAIgASgCDDYCDCACIAEoAhA2AhAgAiABKAIUNgIUIAIgASgCGDYCGCACIAEoAhw2AhwgAiABKAIgNgIgIAIgASgCJDYCJCACIAEoAig2AiggAiABKAIsNgIsIAIgASgCMDYCMCACIAEoAjQ2AjQgAiABKAI4NgI4IAIgASgCPDYCPCABQUBrIQEgAkFAayICIAVNDQALCyACIARPDQEDQCACIAEoAgA2AgAgAUEEaiEBIAJBBGoiAiAESQ0ACwwBCyADQQRJBEAgACECDAELIANBfGoiBCAASQRAIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAiABLQABOgABIAIgAS0AAjoAAiACIAEtAAM6AAMgAUEEaiEBIAJBBGoiAiAETQ0ACwsgAiADSQRAA0AgAiABLQAAOgAAIAFBAWohASACQQFqIgIgA0cNAAsLIAALAwABCzsBAn8/ACEBAkBBkAwoAgAiAiAAaiIAIAFBEHRNDQAgABAEDQBBiAhBMDYCAEF/DwtBkAwgADYCACACCyMAIAA/AEEQdGtB//8DakEQdkAAQX9GBEBBAA8LQQAQAEEBCzsBAX8gAgRAA0AgACABIAJBgCAgAkGAIEkbIgMQASEAIAFBgCBqIQEgAEGAIGohACACIANrIgINAAsLC8YCAQJ/IABBgAFqIgFBf2pB/wE6AAAgAEH/AToAACABQX5qQf8BOgAAIABB/wE6AAEgAUF9akH/AToAACAAQf8BOgACIAFBfGpB/wE6AAAgAEH/AToAAyAAQQAgAGtBA3EiAWoiAEF/NgIAIABBgAEgAWtBfHEiAmoiAUF8akF/NgIAAkAgAkEJSQ0AIABBfzYCCCAAQX82AgQgAUF4akF/NgIAIAFBdGpBfzYCACACQRlJDQAgAEF/NgIYIABBfzYCFCAAQX82AhAgAEF/NgIMIAFBcGpBfzYCACABQWxqQX82AgAgAUFoakF/NgIAIAFBZGpBfzYCACACIABBBHFBGHIiAmsiAUEgSQ0AIAAgAmohAANAIABCfzcDGCAAQn83AxAgAEJ/NwMIIABCfzcDACAAQSBqIQAgAUFgaiIBQR9LDQALCwuGEAEOfyMAQcABayIJJAACf0F+IAFBA24iBkERaiAESw0AGkF/IAMtAABB4AFHDQAaIAlBQGsQBiAJQn83AzggCUJ/NwMwIAlCfzcDKCAJQn83AyAgCUJ/NwMYIAlCfzcDECAJQn83AwggCUJ/NwMAIAMgBGpBcGohESADQQFqIhIgBmohCyABBEAgAkECRyEPQQAhA0EAIQJBACEEA0BBfiALIBFLDQIaAn8gEi0AACIKQe8BTQRAIAlBQGsgCkEEdkF/cyAMakEPcUEDdGoiBigCBCEFIAYoAgAhDSAKQQ9xIgZBD0cEQCAJIApBf3MgBGpBD3FBAnRqKAIAIAMgBhshCCAGRSEKAkAgD0UEQCAAIAJBAXRqIgYgDTsBACAGIAU7AQIgBiAIOwEEDAELIAAgAkECdGoiBiANNgIAIAYgCDYCCCAGIAU2AgQLIAMgCmohAyAJQUBrIAxBA3RqIgYgBTYCBCAGIAg2AgAgCSAEQQJ0aiAINgIAIAlBQGsgDEEBakEPcSIFQQN0aiIGIA02AgAgBiAINgIEIAQgCmohBCAFQQFqDAILIAssAAAiBkH/AXEhBwJ/IAtBAWogBkF/Sg0AGiAHQf8AcSALLAABIgZB/wBxQQd0ciEHIAtBAmogBkF/Sg0AGiALLAACIgZB/wBxQQ50IAdyIQcgC0EDaiAGQX9KDQAaIAssAAMiBkH/AHFBFXQgB3IhByALQQRqIAZBf0oNABogCy0ABEEcdCAHciEHIAtBBWoLIQtBACAHQQFxayAHQQF2cyAOaiEOAkAgD0UEQCAAIAJBAXRqIgYgDTsBACAGIAU7AQIgBiAOOwEEDAELIAAgAkECdGoiBiANNgIAIAYgDjYCCCAGIAU2AgQLIAlBQGsgDEEDdGoiBiAFNgIEIAYgDjYCACAJIARBAnRqIA42AgAgCUFAayAMQQFqQQ9xIgVBA3RqIgYgDTYCACAGIA42AgQgBEEBaiEEIAVBAWoMAQsgCkH9AU0EQCAJIAQgESAKQQ9xai0AACIIQQR2IgVrQQ9xQQJ0aigCACADQQFqIgYgBRshDSAJIAQgCGtBD3FBAnRqKAIAIAYgBUUiBWoiCiAIQQ9xIgYbIQcgBkUhCAJAIA9FBEAgACACQQF0aiIGIAM7AQAgBiANOwECIAYgBzsBBAwBCyAAIAJBAnRqIgYgAzYCACAGIAc2AgggBiANNgIECyAJIARBAnRqIAM2AgAgCUFAayAMQQN0aiIGIAM2AgQgBiANNgIAIAkgBEEBaiIGQQ9xQQJ0aiANNgIAIAlBQGsgDEEBakEPcUEDdGoiBCAHNgIAIAQgDTYCBCAJIAUgBmpBD3EiBUECdGogBzYCACAJQUBrIAxBAmpBD3EiBkEDdGoiBCADNgIAIAQgBzYCBCAFIAhqIQQgCCAKaiEDIAZBAWoMAQsgAyAKQf4BRiIFaiEHIAstAAAiCEEPcSEQAkAgCEEEdiINRQRAIAdBAWohCgwBCyAHIQogCSAEIA1rQQ9xQQJ0aigCACEHCwJAIBBFBEAgCkEBaiEGDAELIAohBiAJIAQgCGtBD3FBAnRqKAIAIQoLAkAgBQRAIAtBAWohCAwBCyALLAABIgVB/wFxIQMCfyALQQJqIAVBf0oNABogA0H/AHEgCywAAiIFQf8AcUEHdHIhAyALQQNqIAVBf0oNABogCywAAyIFQf8AcUEOdCADciEDIAtBBGogBUF/Sg0AGiALLAAEIgVB/wBxQRV0IANyIQMgC0EFaiAFQX9KDQAaIAstAAVBHHQgA3IhAyALQQZqCyEIQQAgA0EBcWsgA0EBdnMgDmoiDiEDCwJAIA1BD0cEQCAIIQUMAQsgCCwAACIFQf8BcSEHAn8gCEEBaiAFQX9KDQAaIAdB/wBxIAgsAAEiBUH/AHFBB3RyIQcgCEECaiAFQX9KDQAaIAgsAAIiBUH/AHFBDnQgB3IhByAIQQNqIAVBf0oNABogCCwAAyIFQf8AcUEVdCAHciEHIAhBBGogBUF/Sg0AGiAILQAEQRx0IAdyIQcgCEEFagshBUEAIAdBAXFrIAdBAXZzIA5qIg4hBwsCQCAQQQ9HBEAgBSELDAELIAUsAAAiCEH/AXEhCgJ/IAVBAWogCEF/Sg0AGiAKQf8AcSAFLAABIghB/wBxQQd0ciEKIAVBAmogCEF/Sg0AGiAFLAACIghB/wBxQQ50IApyIQogBUEDaiAIQX9KDQAaIAUsAAMiCEH/AHFBFXQgCnIhCiAFQQRqIAhBf0oNABogBS0ABEEcdCAKciEKIAVBBWoLIQtBACAKQQFxayAKQQF2cyAOaiIOIQoLAkAgD0UEQCAAIAJBAXRqIgUgAzsBACAFIAc7AQIgBSAKOwEEDAELIAAgAkECdGoiBSADNgIAIAUgCjYCCCAFIAc2AgQLIAlBQGsgDEEDdGoiBSADNgIEIAUgBzYCACAJIARBAnRqIAM2AgAgCUFAayAMQQFqQQ9xQQN0aiIFIAo2AgAgBSAHNgIEIAkgBEEBaiIFQQ9xQQJ0aiAHNgIAIAlBQGsgDEECakEPcUEDdGoiBCADNgIAIAQgCjYCBCAJIAUgDUUgDUEPRnJqIgNBD3FBAnRqIAo2AgAgAyAQRSAQQQ9GcmohBCAGIQMgDEEDagshDCASQQFqIRIgDEEPcSEMIARBD3EhBCACQQNqIgIgAUkNAAsLQQBBfSALIBFGGwshDCAJQcABaiQAIAwLywwBD38jAEGAxABrIhAkAAJ/QX4gAkEBaiAESw0AGkF/IAMtAABBoAFHDQAaIBAgAyAEaiIPIAJrIAIQASELQYDAACACbkHw/wBxIgRBgAIgBEGAAkkbIREgA0EBaiEJAkADQCAMIAFPDQEgESABIAxrIAwgEWogAUkbIQ0CQAJAIAJFBEAgCSEEDAELIA1BD2oiA0FwcSESIANBBHZBA2pBAnYhE0EAIQ4gCSEKA0AgDyAKayATSQRAQQAhCQwDCyAKIBNqIQRBACEJQQAhAyASBEADQCAPIARrQSBJDQQgC0GAwgBqIANqIQgCQAJAAkACQAJAIAogA0EGdmotAAAgA0EDdkEGcXZBA3FBAWsOAwECAwALIAhCADcDACAIQgA3AwgMAwsgCCAELQAEIAQtAAAiBkEGdiIFIAVBA0YiBRs6AAAgCCAEQQRqIAVqIgUtAAAgBkEEdkEDcSIHIAdBA0YiBxs6AAEgCCAFIAdqIgUtAAAgBkECdkEDcSIHIAdBA0YiBxs6AAIgCCAFIAdqIgUtAAAgBkEDcSIGIAZBA0YiBhs6AAMgCCAFIAZqIgUtAAAgBC0AASIGQQZ2IgcgB0EDRiIHGzoABCAIIAUgB2oiBS0AACAGQQR2QQNxIgcgB0EDRiIHGzoABSAIIAUgB2oiBS0AACAGQQJ2QQNxIgcgB0EDRiIHGzoABiAIIAUgB2oiBS0AACAGQQNxIgYgBkEDRiIGGzoAByAIIAUgBmoiBS0AACAELQACIgZBBnYiByAHQQNGIgcbOgAIIAggBSAHaiIFLQAAIAZBBHZBA3EiByAHQQNGIgcbOgAJIAggBSAHaiIFLQAAIAZBAnZBA3EiByAHQQNGIgcbOgAKIAggBSAHaiIFLQAAIAZBA3EiBiAGQQNGIgYbOgALIAggBSAGaiIGLQAAIAQtAAMiBEEGdiIFIAVBA0YiBRs6AAwgCCAFIAZqIgYtAAAgBEEEdkEDcSIFIAVBA0YiBRs6AA0gCCAFIAZqIgYtAAAgBEECdkEDcSIFIAVBA0YiBRs6AA4gCCAFIAZqIggtAAAgBEEDcSIEIARBA0YiBBs6AA8gBCAIaiEEDAILIAggBC0ACCAELQAAIgZBBHYiBSAFQQ9GIgUbOgAAIAggBEEIaiAFaiIFLQAAIAZBD3EiBiAGQQ9GIgYbOgABIAggBSAGaiIGLQAAIAQtAAEiBUEEdiIHIAdBD0YiBxs6AAIgCCAGIAdqIgYtAAAgBUEPcSIFIAVBD0YiBRs6AAMgCCAFIAZqIgYtAAAgBC0AAiIFQQR2IgcgB0EPRiIHGzoABCAIIAYgB2oiBi0AACAFQQ9xIgUgBUEPRiIFGzoABSAIIAUgBmoiBi0AACAELQADIgVBBHYiByAHQQ9GIgcbOgAGIAggBiAHaiIGLQAAIAVBD3EiBSAFQQ9GIgUbOgAHIAggBSAGaiIGLQAAIAQtAAQiBUEEdiIHIAdBD0YiBxs6AAggCCAGIAdqIgYtAAAgBUEPcSIFIAVBD0YiBRs6AAkgCCAFIAZqIgYtAAAgBC0ABSIFQQR2IgcgB0EPRiIHGzoACiAIIAYgB2oiBi0AACAFQQ9xIgUgBUEPRiIFGzoACyAIIAUgBmoiBi0AACAELQAGIgVBBHYiByAHQQ9GIgcbOgAMIAggBiAHaiIGLQAAIAVBD3EiBSAFQQ9GIgUbOgANIAggBSAGaiIGLQAAIAQtAAciBEEEdiIFIAVBD0YiBRs6AA4gCCAFIAZqIggtAAAgBEEPcSIEIARBD0YiBBs6AA8gBCAIaiEEDAELIAggBCkAADcAACAIIAQpAAg3AAggBEEQaiEECyADQRBqIgMgEkkNAAsLIARFDQIgDQRAIAsgDmotAAAhCiAOIQMDQCALQYACaiADaiAKIAtBgMIAaiAJai0AACIKQQF2QQAgCkEBcWtzaiIKOgAAIAIgA2ohAyAJQQFqIgkgDUcNAAsLIAQhCiAOQQFqIg4gAkcNAAsLIAAgAiAMbGogC0GAAmogAiANbBABGiALIAtBgAJqIA1Bf2ogAmxqIAIQARogBCEJCyANQQAgCRsgDGohDCAJDQALQX4MAQtBAEF9IA8gCWsgAkEgIAJBIEsbRhsLIQkgEEGAxABqJAAgCQsLCQEAQZAMCwKwZg==";
	var wasm_simd = "AGFzbQEAAAABHQVgAX8AYAAAYAV/f39/fwF/YAN/f38Bf2ABfwF/AicBA2Vudh9lbXNjcmlwdGVuX25vdGlmeV9tZW1vcnlfZ3Jvd3RoAAADCQgDAQEEBAECAgUDAQABBggBfwFBoN4BCwdTBQZtZW1vcnkCABptZXNob3B0X2RlY29kZVZlcnRleEJ1ZmZlcgAIGW1lc2hvcHRfZGVjb2RlSW5kZXhCdWZmZXIABwZfc3RhcnQABgRzYnJrAAQMAQEKqysI2gMCAX4CewJAIAJBA00EfwJAAkACQAJAIAJBAWsOAwECAwALIAFBAP0M/QEAACAADwsgAEEEaiECIAD9AAAAIgRBBP1mIAT9AwAQARECEgMTBBQFFQYWBxciBEEC/WcgBP0DABABEQISAxMEFAUVBhYHF0GDhowY/Qz9TSIFQQP9BP0YIgT9UkUEQCABIAX9AQAAIAIPCwwDCyAAQQhqIQIgAP0AAAAiBEEE/WcgBP0DABABEQISAxMEFAUVBhYHF0GPnrz4AP0M/U0iBUEP/QT9GCIE/VJFBEAgASAF/QEAACACDwsMAgsgASAA/QAAAP0BAAAgAEEQagUgAAsPCyABIAL9AAAAIAT9EABCgYSQwICCiKCAf4MiA0IgiCADhKciAEEQdiAAQZHEAHFyIgBBCHYgAEHVAHFyIgBBA3RBkAhq/QADACAAQZAYaiIA/QAAACAE/QMAAAAAAAAAAAAAAAAAAAAAIAT9EAFCgYSQwICCiKCAf4MiA0IgiCADhKciAUEQdiABQZHEAHFyIgFBCHYgAUHVAHFyIgFBA3RBkAhq/QADAP1X/QMAAQIDBAUGBxAREhMUFRYX/cABIAUgBP1Q/QEAACABQZAYai0AACACIAAtAABqagv9AQEEfyMAQRBrIQMDQCADIABBf3NBB3Q6AAggAyAAQQFxIgFBgH8gAEEBdkEBcSICGzoACSADIAEgAmoiAUGAfyAAQQJ2QQFxIgIbOgAKIAMgASACaiIBQYB/IABBA3ZBAXEiAhs6AAsgAyABIAJqIgFBgH8gAEEEdkEBcSICGzoADCADIAEgAmoiAUGAfyAAQQV2QQFxIgIbOgANIAMgASACaiIBQYB/IABBBnZBAXEiAhs6AA4gAyABIAJqIgFBgH8gAEEHdkEBcSICGzoADyAAQQN0QZAIaiADKQMINwMAIABBkBhqIAEgAmo6AAAgAEEBaiIAQYACRw0ACwsMABACQYAIQQE6AAALOwECfz8AIQECQEGgHigCACICIABqIgAgAUEQdE0NACAAEAUNAEGYGkEwNgIAQX8PC0GgHiAANgIAIAILIwAgAD8AQRB0a0H//wNqQRB2QABBf0YEQEEADwtBABAAQQELEQEBfyMAIQACQBADCyAAJAALjRABDn8jAEHAAWsiCSQAAn9BfiABQQNuIgZBEWogBEsNABpBfyADLQAAQeABRw0AGiAJQUBrQf8BQYAB/AsAIAlCfzcDOCAJQn83AzAgCUJ/NwMoIAlCfzcDICAJQn83AxggCUJ/NwMQIAlCfzcDCCAJQn83AwAgAyAEakFwaiERIANBAWoiEiAGaiELIAEEQCACQQJHIQ9BACEDQQAhAkEAIQQDQEF+IAsgEUsNAhoCfyASLQAAIgpB7wFNBEAgCUFAayAKQQR2QX9zIAxqQQ9xQQN0aiIGKAIEIQUgBigCACENIApBD3EiBkEPRwRAIAkgCkF/cyAEakEPcUECdGooAgAgAyAGGyEIIAZFIQoCQCAPRQRAIAAgAkEBdGoiBiANOwEAIAYgBTsBAiAGIAg7AQQMAQsgACACQQJ0aiIGIA02AgAgBiAINgIIIAYgBTYCBAsgAyAKaiEDIAlBQGsgDEEDdGoiBiAFNgIEIAYgCDYCACAJIARBAnRqIAg2AgAgCUFAayAMQQFqQQ9xIgVBA3RqIgYgDTYCACAGIAg2AgQgBCAKaiEEIAVBAWoMAgsgCywAACIGQf8BcSEHAn8gC0EBaiAGQX9KDQAaIAdB/wBxIAssAAEiBkH/AHFBB3RyIQcgC0ECaiAGQX9KDQAaIAssAAIiBkH/AHFBDnQgB3IhByALQQNqIAZBf0oNABogCywAAyIGQf8AcUEVdCAHciEHIAtBBGogBkF/Sg0AGiALLQAEQRx0IAdyIQcgC0EFagshC0EAIAdBAXFrIAdBAXZzIA5qIQ4CQCAPRQRAIAAgAkEBdGoiBiANOwEAIAYgBTsBAiAGIA47AQQMAQsgACACQQJ0aiIGIA02AgAgBiAONgIIIAYgBTYCBAsgCUFAayAMQQN0aiIGIAU2AgQgBiAONgIAIAkgBEECdGogDjYCACAJQUBrIAxBAWpBD3EiBUEDdGoiBiANNgIAIAYgDjYCBCAEQQFqIQQgBUEBagwBCyAKQf0BTQRAIAkgBCARIApBD3FqLQAAIghBBHYiBWtBD3FBAnRqKAIAIANBAWoiBiAFGyENIAkgBCAIa0EPcUECdGooAgAgBiAFRSIFaiIKIAhBD3EiBhshByAGRSEIAkAgD0UEQCAAIAJBAXRqIgYgAzsBACAGIA07AQIgBiAHOwEEDAELIAAgAkECdGoiBiADNgIAIAYgBzYCCCAGIA02AgQLIAkgBEECdGogAzYCACAJQUBrIAxBA3RqIgYgAzYCBCAGIA02AgAgCSAEQQFqIgZBD3FBAnRqIA02AgAgCUFAayAMQQFqQQ9xQQN0aiIEIAc2AgAgBCANNgIEIAkgBSAGakEPcSIFQQJ0aiAHNgIAIAlBQGsgDEECakEPcSIGQQN0aiIEIAM2AgAgBCAHNgIEIAUgCGohBCAIIApqIQMgBkEBagwBCyADIApB/gFGIgVqIQcgCy0AACIIQQ9xIRACQCAIQQR2Ig1FBEAgB0EBaiEKDAELIAchCiAJIAQgDWtBD3FBAnRqKAIAIQcLAkAgEEUEQCAKQQFqIQYMAQsgCiEGIAkgBCAIa0EPcUECdGooAgAhCgsCQCAFBEAgC0EBaiEIDAELIAssAAEiBUH/AXEhAwJ/IAtBAmogBUF/Sg0AGiADQf8AcSALLAACIgVB/wBxQQd0ciEDIAtBA2ogBUF/Sg0AGiALLAADIgVB/wBxQQ50IANyIQMgC0EEaiAFQX9KDQAaIAssAAQiBUH/AHFBFXQgA3IhAyALQQVqIAVBf0oNABogCy0ABUEcdCADciEDIAtBBmoLIQhBACADQQFxayADQQF2cyAOaiIOIQMLAkAgDUEPRwRAIAghBQwBCyAILAAAIgVB/wFxIQcCfyAIQQFqIAVBf0oNABogB0H/AHEgCCwAASIFQf8AcUEHdHIhByAIQQJqIAVBf0oNABogCCwAAiIFQf8AcUEOdCAHciEHIAhBA2ogBUF/Sg0AGiAILAADIgVB/wBxQRV0IAdyIQcgCEEEaiAFQX9KDQAaIAgtAARBHHQgB3IhByAIQQVqCyEFQQAgB0EBcWsgB0EBdnMgDmoiDiEHCwJAIBBBD0cEQCAFIQsMAQsgBSwAACIIQf8BcSEKAn8gBUEBaiAIQX9KDQAaIApB/wBxIAUsAAEiCEH/AHFBB3RyIQogBUECaiAIQX9KDQAaIAUsAAIiCEH/AHFBDnQgCnIhCiAFQQNqIAhBf0oNABogBSwAAyIIQf8AcUEVdCAKciEKIAVBBGogCEF/Sg0AGiAFLQAEQRx0IApyIQogBUEFagshC0EAIApBAXFrIApBAXZzIA5qIg4hCgsCQCAPRQRAIAAgAkEBdGoiBSADOwEAIAUgBzsBAiAFIAo7AQQMAQsgACACQQJ0aiIFIAM2AgAgBSAKNgIIIAUgBzYCBAsgCUFAayAMQQN0aiIFIAM2AgQgBSAHNgIAIAkgBEECdGogAzYCACAJQUBrIAxBAWpBD3FBA3RqIgUgCjYCACAFIAc2AgQgCSAEQQFqIgVBD3FBAnRqIAc2AgAgCUFAayAMQQJqQQ9xQQN0aiIEIAM2AgAgBCAKNgIEIAkgBSANRSANQQ9GcmoiA0EPcUECdGogCjYCACADIBBFIBBBD0ZyaiEEIAYhAyAMQQNqCyEMIBJBAWohEiAMQQ9xIQwgBEEPcSEEIAJBA2oiAiABSQ0ACwtBAEF9IAsgEUYbCyEMIAlBwAFqJAAgDAu/FAIQfwh7IwBBgMoAayIKJABBgAgtAABFBEAQAkGACEEBOgAACwJ/QX4gAkEBaiAESw0AGkF/IAMtAABBoAFHDQAaIAogAyAEaiIIIAJrIAL8CgAAQYDAACACbkHw/wBxIgRBgAIgBEGAAkkbIRIgA0EBaiEFAkADQCAMIAFPDQEgEiABIAxrIAwgEmogAUkbIQ0CQAJAAkAgAkUEQCAFIQYMAQsgDUEPaiIDQQR2QQNqQQJ2IQkgA0FwcSIHQQNsIhMgCkGAwgBqaiEPIAdBAXQiFCAKQYDCAGpqIRAgCkGAwgBqIAdqIRFBACEOIAUhBgNAIAggBmshAwJAIAdBP00EQCADIAlJDQQgBiAJaiEEQQAhBUEAIQMgBwRAA0AgCCAEa0EgSQ0HIAQgCkGAwgBqIANqIAYgA0EGdmotAAAgA0EDdkEGcXZBA3EQASEEIANBEGoiAyAHSQ0ACwsgBEUNBSAIIARrIAlJDQUgBCAJaiEGQQAhAyAHBEADQCAIIAZrQSBJDQcgBiADIBFqIAQgA0EGdmotAAAgA0EDdkEGcXZBA3EQASEGIANBEGoiAyAHSQ0ACwsgBkUNBSAIIAZrIAlJDQUgBiAJaiEEQQAhAyAHBEADQCAIIARrQSBJDQcgBCADIBBqIAYgA0EGdmotAAAgA0EDdkEGcXZBA3EQASEEIANBEGoiAyAHSQ0ACwsgBEUNBSAIIARrIAlJDQUgBCAJaiEGQQAhAyAHBEADQCAIIAZrQSBJDQcgBiADIA9qIAQgA0EGdmotAAAgA0EDdkEGcXZBA3EQASEGIANBEGoiAyAHSQ0ACwsgBg0BDAULIAMgCUkNA0EAIQVBwAAhC0EAIQQCQCAIIAYgCWoiA2tBgAFJDQADQCADIApBgMIAaiAFaiIDIAYgBUEGdmotAAAiBEEDcRABIANBEGogBEECdkEDcRABIANBIGogBEEEdkEDcRABIANBMGogBEEGdhABIQMgCyIEQUBrIgsgB0sNASAEIQUgCCADa0H/AEsNAAsLIAQgB0kEQANAIAggA2tBIEkNBSADIApBgMIAaiAEaiAGIARBBnZqLQAAIARBA3ZBBnF2QQNxEAEhAyAEQRBqIgQgB0kNAAsLQQAhBSADRQ0EIAggA2sgCUkNBEHAACELQQAhBAJAIAggAyAJaiIGa0GAAUkNAANAIAYgBSARaiIEIAMgBUEGdmotAAAiBUEDcRABIARBEGogBUECdkEDcRABIARBIGogBUEEdkEDcRABIARBMGogBUEGdhABIQYgCyIEQUBrIgsgB0sNASAEIQUgCCAGa0H/AEsNAAsLIAQgB0kEQANAIAggBmtBIEkNBSAGIAQgEWogAyAEQQZ2ai0AACAEQQN2QQZxdkEDcRABIQYgBEEQaiIEIAdJDQALC0EAIQUgBkUNBCAIIAZrIAlJDQRBwAAhC0EAIQQCQCAIIAYgCWoiA2tBgAFJDQADQCADIAUgEGoiAyAGIAVBBnZqLQAAIgRBA3EQASADQRBqIARBAnZBA3EQASADQSBqIARBBHZBA3EQASADQTBqIARBBnYQASEDIAsiBEFAayILIAdLDQEgBCEFIAggA2tB/wBLDQALCyAEIAdJBEADQCAIIANrQSBJDQUgAyAEIBBqIAYgBEEGdmotAAAgBEEDdkEGcXZBA3EQASEDIARBEGoiBCAHSQ0ACwtBACEFIANFDQQgCCADayAJSQ0EQcAAIQtBACEEAkAgCCADIAlqIgZrQYABSQ0AA0AgBiAFIA9qIgQgAyAFQQZ2ai0AACIFQQNxEAEgBEEQaiAFQQJ2QQNxEAEgBEEgaiAFQQR2QQNxEAEgBEEwaiAFQQZ2EAEhBiALIgRBQGsiCyAHSw0BIAQhBSAIIAZrQf8ASw0ACwsgBCAHSQRAA0AgCCAGa0EgSQ0FIAYgBCAPaiADIARBBnZqLQAAIARBA3ZBBnF2QQNxEAEhBiAEQRBqIgQgB0kNAAsLIAZFDQMLIAcEQCAKQYACaiAOaiEEIAogDmr9AAIAIRZBACEFA0AgBCAKQYDCAGogBWoiA/0ABAAiFUEB/VYgFUEB/QQiFf1N/VH9TyIYIAMgB2r9AAQAIhdBAf1WIBcgFf1N/VH9TyIX/QMAEAERAhIDEwQUBRUGFgcXIhsgAyAUav0ABAAiGUEB/VYgGSAV/U39Uf1PIhkgAyATav0ABAAiGkEB/VYgGiAV/U39Uf1PIhr9AwAQARECEgMTBBQFFQYWBxciHP0DAAEQEQIDEhMEBRQVBgcWFyIVIBX9AwABAgMAAQIDAAECAwABAgMgFv1XIhb9DQA2AgAgAiAEaiIDIBYgFSAV/QMEBQYHBAUGBwQFBgcEBQYH/VciFv0NADYCACACIANqIgMgFiAVIBX9AwgJCgsICQoLCAkKCwgJCgv9VyIW/Q0ANgIAIAIgA2oiAyAWIBUgFf0DDA0ODwwNDg8MDQ4PDA0OD/1XIhX9DQA2AgAgAiADaiIDIBUgGyAc/QMICRgZCgsaGwwNHB0ODx4fIhUgFf0DAAECAwABAgMAAQIDAAECA/1XIhb9DQA2AgAgAiADaiIDIBYgFSAV/QMEBQYHBAUGBwQFBgcEBQYH/VciFv0NADYCACACIANqIgMgFiAVIBX9AwgJCgsICQoLCAkKCwgJCgv9VyIW/Q0ANgIAIAIgA2oiAyAWIBUgFf0DDA0ODwwNDg8MDQ4PDA0OD/1XIhX9DQA2AgAgAiADaiIDIBUgGCAX/QMIGAkZChoLGwwcDR0OHg8fIhYgGSAa/QMIGAkZChoLGwwcDR0OHg8fIhj9AwABEBECAxITBAUUFQYHFhciFSAV/QMAAQIDAAECAwABAgMAAQID/VciF/0NADYCACACIANqIgMgFyAVIBX9AwQFBgcEBQYHBAUGBwQFBgf9VyIX/Q0ANgIAIAIgA2oiAyAXIBUgFf0DCAkKCwgJCgsICQoLCAkKC/1XIhf9DQA2AgAgAiADaiIDIBcgFSAV/QMMDQ4PDA0ODwwNDg8MDQ4P/VciFf0NADYCACACIANqIgMgFSAWIBj9AwgJGBkKCxobDA0cHQ4PHh8iFSAV/QMAAQIDAAECAwABAgMAAQID/VciFv0NADYCACACIANqIgMgFiAVIBX9AwQFBgcEBQYHBAUGBwQFBgf9VyIW/Q0ANgIAIAIgA2oiAyAWIBUgFf0DCAkKCwgJCgsICQoLCAkKC/1XIhb9DQA2AgAgAiADaiIDIBYgFSAV/QMMDQ4PDA0ODwwNDg8MDQ4P/VciFv0NADYCACACIANqIQQgBUEQaiIFIAdJDQALCyAOQQRqIg4gAkkNAAsLIAAgAiAMbGogCkGAAmogAiANbPwKAAAgCiAKQYACaiANQX9qIAJsaiAC/AoAACAGIQUMAQtBACEFCyANQQAgBRsgDGohDCAFDQALQX4MAQtBAEF9IAggBWsgAkEgIAJBIEsbRhsLIQUgCkGAygBqJAAgBQsLCQEAQaAeCwLAbw==";

	var wasm = debase64(wasm_base);

	var instance, heap;

	var env = {
		emscripten_notify_memory_growth: function(index) {
			heap = new Uint8Array(instance.exports.memory.buffer);
		}
	};

	var promise =
		WebAssembly.instantiate(wasm, { env })
		.then(function(result) {
			instance = result.instance;
			if (instance.exports.__wasm_call_ctors) {
				instance.exports.__wasm_call_ctors();
			}
			env.emscripten_notify_memory_growth(0);
		});

	function debase64(base64) {
		if (typeof atob == 'function') {
			var data = atob(base64);
			var bytes = new Uint8Array(data.length);
			for (var i = 0; i < data.length; i++) {
				bytes[i] = data.charCodeAt(i);
			}
			return bytes.buffer;
		} else {
			return Buffer.from(base64, 'base64').buffer;
		}
	}

	function decode(fun, target, count, size, source) {
		var sbrk = instance.exports.sbrk;
		var tp = sbrk(count * size);
		var sp = sbrk(source.length);
		heap.set(source, sp);
		var res = fun(tp, count, size, sp, source.length);
		target.set(heap.subarray(tp, tp + count * size));
		sbrk(tp - sbrk(0));
		if (res != 0) {
			throw new Error("Malformed buffer data: " + res);
		}
	};

	return {
		ready: promise,
		decodeVertexBuffer: function(target, count, size, source) {
			decode(instance.exports.meshopt_decodeVertexBuffer, target, count, size, source);
		},
		decodeIndexBuffer: function(target, count, size, source) {
			decode(instance.exports.meshopt_decodeIndexBuffer, target, count, size, source);
		}
	};
})();

if (typeof exports === 'object' && typeof module === 'object')
	module.exports = MeshoptDecoder;
else if (typeof define === 'function' && define['amd'])
	define([], function() {
		return MeshoptDecoder;
	});
else if (typeof exports === 'object')
	exports["MeshoptDecoder"] = MeshoptDecoder;
