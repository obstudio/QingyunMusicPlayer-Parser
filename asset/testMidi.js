// eslint-env: web
var audioLibDir = 'https://jjyyxx.github.io/webaudiofontdata/data/'
var defaultInstr = 'Piano'

var instrDict = {
    'Piano': 0,
    'BrightPiano': 1,
    'ElectricGrandPiano': 2,
    'HonkyTonkPiano': 3,
    'ElectricPiano': 4,
    'ElectricPiano2': 5,
    'Harpsichord': 6,
    'Clavi': 7,
    'Celesta': 8,
    'Glockenspiel': 9,
    'MusicBox': 10,
    'Vibraphone': 11,
    'Marimba': 12,
    'Xylophone': 13,
    'TubularBells': 14,
    'Dulcimer': 15,
    'DrawbarOrgan': 16,
    'PercussiveOrgan': 17,
    'RockOrgan': 18,
    'Organ': 19,
    'ReedOrgan': 20,
    'Accordion': 21,
    'Harmonica': 22,
    'Bandoneon': 23,
    'Guitar': 24,
    'SteelGuitar': 25,
    'JazzGuitar': 26,
    'ElectricGuitar': 27,
    'GuitarMuted': 28,
    'GuitarOverdriven': 29,
    'GuitarDistorted': 30,
    'GuitarHarmonics': 31,
    'Bass': 32,
    'ElectricBass': 33,
    'PickedBass': 34,
    'FretlessBass': 35,
    'SlapBass': 36,
    'SlapBass2': 37,
    'SynthBass': 38,
    'SynthBass2': 39,
    'Violin': 40,
    'Viola': 41,
    'Cello': 42,
    'Contrabass': 43,
    'TremoloStrings': 44,
    'PizzicatoStrings': 45,
    'Harp': 46,
    'Timpani': 47,
    'Strings': 48,
    'Strings2': 49,
    'SynthStrings': 50,
    'SynthStrings2': 51,
    'VoiceAahs': 52,
    'VoiceOohs': 53,
    'Voice': 54,
    'OrchestraHit': 55,
    'Trumpet': 56,
    'Trombone': 57,
    'Tuba': 58,
    'MutedTrumpet': 59,
    'FrenchHorn': 60,
    'BrassSection': 61,
    'SynthBrass': 62,
    'SynthBrass2': 63,
    'SopranoSax': 64,
    'AltoSax': 65,
    'TenorSax': 66,
    'BaritoneSax': 67,
    'Oboe': 68,
    'EnglishHorn': 69,
    'Bassoon': 70,
    'Clarinet': 71,
    'Piccolo': 72,
    'Flute': 73,
    'Recorder': 74,
    'PanFlute': 75,
    'BlownBottle': 76,
    'Shakuhachi': 77,
    'Whistle': 78,
    'Ocarina': 79,
    'Square': 80,
    'Sawtooth': 81,
    'Calliope': 82,
    'Chiff': 83,
    'Charang': 84,
    'SynthVoice': 85,
    'Fifths': 86,
    'BassAndLead': 87,
    'NewAge': 88,
    'Warm': 89,
    'Polysynth': 90,
    'Choir': 91,
    'Bowed': 92,
    'Metallic': 93,
    'Halo': 94,
    'Sweep': 95,
    'Rain': 96,
    'Soundtrack': 97,
    'Crystal': 98,
    'Atmosphere': 99,
    'Brightness': 100,
    'Goblins': 101,
    'Echoes': 102,
    'SciFi': 103,
    'Sitar': 104,
    'Banjo': 105,
    'Shamisen': 106,
    'Koto': 107,
    'Kalimba': 108,
    'Bagpipe': 109,
    'Fiddle': 110,
    'Shanai': 111,
    'Tinklebell': 112,
    'Agogo': 113,
    'Steeldrums': 114,
    'Woodblock': 115,
    'Taiko': 116,
    'MelodicTom': 117,
    'SynthDrum': 118,
    'ReverseCymbal': 119,
    'FretNoise': 120,
    'Breath': 121,
    'Seashore': 122,
    'Bird': 123,
    'Telephone': 124,
    'Helicopter': 125,
    'Applause': 126,
    'Gunshot': 127
}
// Possible issues: 40, 41, 48 may be incorrect 
var drumDict = {
    'BassDrum2': 35,
    'BassDrum': 36,
    'SideStick': 37,
    'Snare': 38,
    'Clap': 39,
    'ElectricSnare': 40,
    'LowFloorTom': 41,
    'HiHatClosed': 42,
    'LowTom': 43,
    'HiHatPedal': 44,
    'MidTom2': 45,
    'HiHatOpen': 46,
    'MidTom': 47,
    'HighFloorTom': 48,
    'CrashCymbal': 49,
    'HighTom': 50,
    'RideCymbal': 51,
    'ChineseCymbal': 52,
    'RideBell': 53,
    'Tambourine': 54,
    'SplashCymbal': 55,
    'Cowbell': 56,
    'CrashCymbal2': 57,
    'Vibraslap': 58,
    'RideCymbal2': 59,
    'HighBongo': 60,
    'LowBongo': 61,
    'HighCongaMute': 62,
    'HighCongaOpen': 63,
    'LowConga': 64,
    'HighTimbale': 65,
    'LowTimbale': 66,
    'HighAgogo': 67,
    'LowAgogo': 68,
    'Cabasa': 69,
    'Maracas': 70,
    'WhistleShort': 71,
    'WhistleLong': 72,
    'GuiroShort': 73,
    'GuiroLong': 74,
    'Claves': 75,
    'HighWoodblock': 76,
    'LowWoodblock': 77,
    'MuteCuica': 78,
    'OpenCuica': 79,
    'MuteTriangle': 80,
    'OpenTriangle': 81
}

function audioLibFile(instr) {
    if (instr == '') {
        instr = defaultInstr
    }
    if (instr in instrDict) {
        return audioLibDir + ('00' + instrDict[instr].toString()).slice(-3) + '0_FluidR3_GM_sf2_file.json'
    } else {
        return audioLibDir + '128' + drumDict[instr].toString() + '_0_FluidR3_GM_sf2_file.json'
    }
}

function audioLibVar(instr) {
    if (instr == '') {
        instr = defaultInstr
    }
    if (instr in instrDict) {
        return '_tone_' + ('00' + instrDict[instr].toString()).slice(-3) + '0_FluidR3_GM_sf2_file'
    } else {
        return '_drum_' + drumDict[instr].toString() + '_0_FluidR3_GM_sf2_file'
    }
}

function play() {
    var file = document.getElementById('file').files[0]
    window.fonts = window.fonts || {}
    var reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function (event) {
        var result = event.target.result
        var tracks = JSON.parse(result)
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)()
        var player = new window.WebAudioFontPlayer()
        const instrNames = tracks.map((track) => track['Instrument'])
        Promise.all(instrNames.map((instr) => player.loader.load(audioCtx, audioLibFile(instr), audioLibVar(instr)))).then(
            (instrs) => {
                var initialTime = audioCtx.currentTime
                for (var i = 0, length = tracks.length; i < length; i++) {
                    var content = tracks[i]['Content']
                    for (var j = 0; j < content.length; j++) {
                        if (content[j]['Type'] == 'Note') {
                            player.queueWaveTable(
                                audioCtx,
                                audioCtx.destination,
                                window.fonts[instrs[i]],
                                content[j]['StartTime'] + initialTime,
                                ((content[j]['Pitch'] === null) ? (drumDict[tracks[i]['Instrument']]) : (content[j]['Pitch'] + 60)),
                                content[j]['Duration'],
                                content[j]['Volume']
                            )
                        }
                    }
                }
            }
        )
    }
}