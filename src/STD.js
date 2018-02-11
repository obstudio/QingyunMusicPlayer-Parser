const { SubtrackParser } = require('./TrackParser')
const { AssignSetting } = require('./Util')

module.exports = {
    Tremolo1(expr, subtrack) {
        const t = new SubtrackParser(subtrack, this.Settings, this.Libraries).parseTrack()
        const pow = Math.pow(2, -expr)
        const num = t.Meta.Duration / pow
        const result = []
        const length = t.Contents.length
        for (let i = 0; i < num; i++) {
            const startTime = i * pow
            for (let j = 0; j < length; j++) {
                result.push({ ...(t.Contents[j]), StartTime: startTime, Duration: pow })
            }
        }

        return {
            Contents: result,
            Meta: t.Meta
        }
    },

    Tremolo2(expr, subtrack1, subtrack2) {
        const ts = [new SubtrackParser(subtrack1, this.Settings, this.Libraries).parseTrack(), new SubtrackParser(subtrack2, this.Settings, this.Libraries).parseTrack()]
        const pow = Math.pow(2, -expr)
        const num = ts[1].Meta.Duration / pow
        const lengths = ts.map((t) => t.Contents.length)
        const result = []
        for (let i = 0; i < num; i++) {
            const startTime = i * pow
            const index = i % 2
            for (let j = 0; j < lengths[index]; j++) {
                result.push({ ...(ts[index].Contents[j]), StartTime: startTime, Duration: pow })
            }
        }

        return {
            Contents: result,
            Meta: {
                Duration: ts[1].Meta.Duration,
                Incomplete: ts[1].Meta.Incomplete,
                Single: true,
                Warnings: [],
                PitchQueue: [...ts[0].Meta.PitchQueue, ...ts[1].Meta.PitchQueue],
                NotesBeforeTie: ts[(num - 1) % 2].Meta.NotesBeforeTie
            }
        }
    },

    Tuplet(expr, subtrack) {
        const scale = Math.pow(2, Math.floor(Math.log2(expr))) / expr
        const t = new SubtrackParser(subtrack, this.Settings, this.Libraries).parseTrack()
        t.Contents.forEach((note) => {
            note.Duration *= scale
            note.StartTime *= scale
        })
        t.Meta.Duration *= scale
        return t
    },

    Portamento(subtrack1, subtrack2) {
        const t1 = new SubtrackParser(subtrack1, this.Settings, this.Libraries).parseTrack()
        const t2 = new SubtrackParser(subtrack2, this.Settings, this.Libraries).parseTrack()

        const pitch1 = t1.Contents[0].Pitch
        const pitch2 = t2.Contents[0].Pitch
        const duration = t1.Meta.Duration
        const port = this.Settings.Port
        const num = duration * port
        const step = (pitch2 - pitch1) / (num - 1)
        const pitches = []
        for (let i = 0; i < port; i++) {
            pitches.push(Math.round(pitch1 + step * i))
        }

        const result = pitches.map((pitch, index) => {
            return {
                Type: 'Note',
                Pitch: pitch,
                Volume: t2.Contents[0].Volume,
                Duration: 1 / port,
                StartTime: index / port
            }
        })

        return {
            Contents: result,
            Meta: {
                Duration: duration,
                Incomplete: [duration],
                Single: true,
                Warnings: [],
                PitchQueue: [...t1.Meta.PitchQueue, ...t2.Meta.PitchQueue],
                NotesBeforeTie: [result[result.length - 1]]
            }
        }
    },

    GraceNote(subtrack1, subtrack2) {
        const t1 = new SubtrackParser(subtrack1, this.Settings, this.Libraries).parseTrack()
        const t2 = new SubtrackParser(subtrack2, this.Settings, this.Libraries).parseTrack()
        const num = subtrack1.Contents.length
        let dur
        if (num <= 4) {
            dur = this.Settings.Appo / 4
        } else {
            dur = this.Settings.Appo / num
        }
        t1.Contents.forEach((note) => {
            note.Duration = dur
            note.StartTime *= dur
        })
        const total = dur * num
        t2.Contents.forEach((note) => {
            note.StartTime += total
            note.Duration -= total
        })
        return {
            Contents: [...t1.Contents, ...t2.Contents],
            Meta: t2.Meta
        }
    },

    Appoggiatura(subtrack1, subtrack2) {
        const t1 = new SubtrackParser(subtrack1, this.Settings, this.Libraries).parseTrack()
        const t2 = new SubtrackParser(subtrack2, this.Settings, this.Libraries).parseTrack()
        const num = subtrack2.Contents.length
        let dur
        if (num <= 4) {
            dur = this.Settings.Appo / 4
        } else {
            dur = this.Settings.Appo / num
        }

        const total = dur * num
        t1.Contents.forEach((note) => {
            note.Duration -= total
        })
        t2.Contents.forEach((note) => {
            note.Duration = dur
            note.StartTime *= dur
            note.StartTime += t1.Contents[0].Duration
        })

        return {
            Contents: [...t1.Contents, ...t2.Contents],
            Meta: t1.Meta
        }
    },

    ConOct(octave, volumeScale = 1) {
        AssignSetting(this.Settings, 'ConOct', octave, (octave) => Number.isInteger(octave))
        AssignSetting(this.Settings, 'ConOctVolume', volumeScale, (volume) => volume >= 0)
    },
    Vol(volume) {
        AssignSetting(this.Settings, 'Volume', volume / 100, (volume) => volume <= 1 && volume >= 0)
    },
    Spd(speed) {
        AssignSetting(this.Settings, 'Speed', speed, (speed) => speed > 0)
    },
    Key(key) {
        AssignSetting(this.Settings, 'Key', key, (key) => Number.isInteger(key))
    },
    Oct(oct) {
        AssignSetting(this.Settings, 'Octave', oct, (octave) => Number.isInteger(octave))
    },
    KeyOct(keyOct) {
        let key, oct, splitIndex
        if (keyOct.endsWith('\'')) {
            splitIndex = keyOct.indexOf('\'')
            key = keyOct.slice(0, splitIndex)
            oct = keyOct.length - splitIndex + 1
        } else if (keyOct.endsWith(',')) {
            splitIndex = keyOct.indexOf('\'')
            key = keyOct.slice(0, splitIndex)
            oct = keyOct.length - splitIndex + 1
        } else {
            key = keyOct
            oct = 0
        }
        const Tonality = {
            'C': 0,
            'G': 7,
            'D': 2,
            'A': 9,
            'E': 4,
            'B': -1,
            '#F': 6,
            '#C': 1,
            'F': 5,
            'bB': -2,
            'bE': 3,
            'bA': 8,
            'bD': 1,
            'bG': 6,
            'bC': -1,

            'F#': 6,
            'C#': 1,
            'Bb': -2,
            'Eb': 3,
            'Ab': 8,
            'Db': 1,
            'Gb': 6,
            'Cb': -1,
        }
        AssignSetting(this.Settings, 'Key', Tonality[key], (key) => Number.isInteger(key))
        AssignSetting(this.Settings, 'Octave', oct, (octave) => Number.isInteger(octave))
    },
    Beat(beat) {
        AssignSetting(this.Settings, 'Beat', beat, (beat) => beat > 0 && Number.isInteger(Math.log2(beat)))
    },
    Bar(bar) {
        AssignSetting(this.Settings, 'Bar', bar, (bar) => bar > 0 && Number.isInteger(bar))
    },
    BarBeat(bar, beat) {
        AssignSetting(this.Settings, 'Bar', bar, (bar) => bar > 0 && Number.isInteger(bar))
        AssignSetting(this.Settings, 'Beat', beat, (beat) => beat > 0 && Number.isInteger(Math.log2(beat)))
    },
    Dur(scale) {
        AssignSetting(this.Settings, 'Duration', scale, (scale) => scale > 0)
    },
    Acct(scale) {
        AssignSetting(this.Settings, 'Accent', scale, (scale) => scale > 1)
    },
    Light(scale) {
        AssignSetting(this.Settings, 'Light', scale, (scale) => scale < 1 && scale > 0)
    },
    Appo(r) {
        AssignSetting(this.Settings, 'Appo', r, (r) => r > 0)
    },
    Port(r) {
        AssignSetting(this.Settings, 'Port', r, (r) => r > 0)
    },
    Trace(count) {
        AssignSetting(this.Settings, 'Trace', count, count > 0 && count <= 4 && Number.isInteger(count))
    },
    FadeIn(time) {
        AssignSetting(this.Settings, 'FadeIn', time, (time) => time >= 0)
    },
    FadeOut(time) {
        AssignSetting(this.Settings, 'FadeOut', time, (time) => time >= 0)
    },
    Rev(r) {
        AssignSetting(this.Settings, 'Rev', r, () => true)
    },
    setVar(key, value) {
        this.Settings.Var[key] = value
    },
    getVar(key, defaultValue = null) {
        return this.Settings.Var[key] ? this.Var[key] : defaultValue
    },
    Stac(restProportion, index = 1) {
        if (typeof restProportion !== 'number') throw new TypeError('Non-numeric value passed in as Stac')
        if (!((restProportion) => restProportion >= 0 && restProportion <= 1)(restProportion)) throw new RangeError('Stac out of range')
        if (![0, 1, 2].indexOf(index)) throw new RangeError('Stac index out of range')
        this.Settings.Stac[index] = restProportion
    }
}
