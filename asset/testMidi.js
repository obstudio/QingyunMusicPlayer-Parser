// eslint-env: web

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

function audioLib(instr_No) {
    return ('00' + instr_No.toString()).slice(-3) + '0_SoundBlasterOld_sf2'
}

// function changeInstrument(player, path, name) {
//     player.loader.waitLoad(function () {
//         instr = window[name]
//     })
// }

function play() {
    var file = document.getElementById('file').files[0]
    var reader = new FileReader()
    reader.readAsText(file)
    reader.onload = function (event) {
        var result = event.target.result
        var tracks = JSON.parse(result)
        var audioCtx = new (window.AudioContext || window.webkitAudioContext)()
        var player = new window.WebAudioFontPlayer()
        Promise.all(tracks.map((track) => player.loader.load(audioCtx, 'https://jjyyxx.github.io/webaudiofontdata/data/' + audioLib(instrDict[track['Instrument']]) + '.json', '_tone_' + audioLib(instrDict[track['Instrument']])))).then(
            () => {
                var initialTime = audioCtx.currentTime
                for (var i = 0, length = tracks.length; i < length; i++) {
                    var contents = tracks[i]['Contents']
                    for (var j = 0; j < contents.length; j++) {
                        if (contents[j]['Type'] == 'Note') {
                            player.queueWaveTable(
                                audioCtx,
                                audioCtx.destination,
                                window['_tone_' + audioLib(instrDict[tracks[i]['Instrument']])],
                                contents[j]['StartTime'] + initialTime,
                                contents[j]['Pitch'] + 60,
                                contents[j]['Duration'],
                                contents[j]['Volume']
                            )
                        }
                    }
                }
            }
        )
    }
}