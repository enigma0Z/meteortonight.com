# Program a (subtractive) synth in under a minute

{yt-embed::horizontal::lUggXRg2oUQ}

Learn the basics of subtractive synthesizers: let me be your dirty intro into
the world of synthesized sounds!

## Getting Started

### What kind of synth you should start with

A subtractive synthesizer.  *MOST* synthesizers fit this description, but any
kind of _subtractive_ synthesizer that includes basic "analog" sounds (Square,
Sawtooth, etc...).  In the video, I'm using a Roland SH-4d on the SH-101 mode.

### Where to start when learning (or programming a new sound)

There are three elements that form the core of your sound:

1. Oscillator
2. (Amp) Envelope
3. Filter

## Oscillator

This is the foundation of your synthesizer's sound.  Oscillators come in many
different types or "wave" shapes.  I like to lump oscillators into three
different camps:

* "Simple" waveforms: the bread & butter of synthesizer sounds, simple does not
  mean bad, and many modern sounds are still based on these wave shapes.
* Samples and wavetables: These are based on previously recorded and processed
  sounds, and can be used to generate unique timbres.
* FM and additative synthesis: These are both (typically) based on combining
  sine waves in unique ways.

We are going to focus on the **"Simple"** waveforms.

### "Simple" Waves 

These are the basic sounds you'll find on nearly any subtractive synthesizer,
and a great deal of synthesized sounds from when synthesizers were invented
through even to modern music rely on these sounds.  **Yes, they're _that_
fundamental**.

* Sawtooth: _buzzy or "sharp" sounding_
* Square: _hollow sounding_
* Triangle: _hollow sounding, darker_
* Sine: _a singular frequency, like a TV **bleep**_

### Sawtooth wave

![sawtooth wave](/img/synth-school/in-under-a-minute/basic-subtractive-synth/sawtooth-wave.png#center)

This wave is made up of the entire harmonic series, and is useful for
synthesizing many string-based sounds, whether that is a plucked or bowed
string.  Many EDM and dance synthesizers are also based on the lowly saw wave.

### Square wave

![square wave](/img/synth-school/in-under-a-minute/basic-subtractive-synth/square-wave.png#center)

This wave is made up of odd harmonics only and that lends it to have a hollow
sound.  High levels of distortion on a guitar can also create this same type of
sound with the way that clipping circuits and diodes cut off sounds.

### Triangle wave

![triangle wave](/img/synth-school/in-under-a-minute/basic-subtractive-synth/triangle-wave.png#center)

This wave similar to a square wave in that it is also made up of odd harmonics
only, but a triangle wave's higher frequencies roll off quicker, which gives it
a quieter or darker sound (compared to a square wave). 

### Sine wave

![sine wave](/img/synth-school/in-under-a-minute/basic-subtractive-synth/sine-wave.png#center)

If you've been confused so far about the talk of frequencies or harmonics, than
this is the wave for you.  A sine wave is the most basic sound, a single
frequency with no harmonics.  In subtractive synthesis, this may be used to feed
a distortion effect or stacked with other waves to emphasize certain
characteristics, but is not often used entirely on its own.

## (Amp) Envelope

An envelope changes some parameter(s) of your sound, over time, when you press a
key.  The most important envelope that nearly every synthesizer has is the
**amp**lifier envelope.  When you press a key to play a note, that key generates
a trigger, which tells your synth to start running the envelope(s) that are tied
to the patch you're working on.

The most common kind of envelope is an **ADSR** envelope.  ADSR stands for

* Attack
* Decay
* Sustain
* Release

![envelope (adsr)](/img/synth-school/in-under-a-minute/basic-subtractive-synth/envelope.png#center)

### ADSR: Attack

This is how quickly your sound goes from no volume to full volume.  That's about
it.  A slow attack on an amp envelope will give a slow swell of sound such as a
synth pad or bowed strings.  A fast attack on an amp envelope will cause your
sound to start very quickly, much like a plucked string or piano.

* Slow attack: Synth pad
* Fast attack: Synth lead

### ADSR: Decay

Once the attack phase of the envelope is over, the sound then starts decreasing
in volume until it reaches the sustain level.  How long it takes to get from
peak to sustain level is the **decay* of your envelope.

* Slow decay: Natural-sounding "Ring out" of a note
* Fast decay: Plucky sounding

### ADSR: Sustain

Rather than being a time value, sustain represents the level at which your sound
stays while you are holding a key down.  This is because *you* provide the
length value for this phase of your ADSR when you press and release a key.

* High sustain: Organ or synth lead sound
  > Note: Maximum sustain actually makes the decay value not really have any
  > effect since there's no place to go from 100% to 100%
* Low sustain: Ringing-out or plucky sounding, depending on decay speed

### ADSR: Release

Once you let go of a key, how long does it take for your sound to fade out.
This can be used to get a makeshift reverb sound or help tie notes in a mono
synth patch.  In a poly synth, a high release value can cause things to sound
muddy if too many notes are played at once

* Slow release: Sound rings out after a key is released (like a marimba or plucked string)
* Fast release: Sound cuts off quickly like an organ

## Filter

Filters are used in all types of synthesis, but the filter is what makes
_subtractive_ synthesizers **subtractive**.  What a filter does is removes
certain frequencies or harmonics from a sound, which changes the character or
_timbre_ of the sound.  Much like oscillators, there are many different types of
filters, but I like to lump them into a few categories:

* Passing filters ("pass" or allow certain frequencies through, "cut" or reject
  others)
* Time-based filters duplicate your signal and feed it back into the output (a
  comb filter is a good example)
* Multi-frequency and stacked filters are typically combinations of passing
  filters in serial or parallel (a formant filter is a good example of this)
  
We are going to focus on passing filters.

### Passing filters

Passing filters, often called by what frequencies they allow through (e.g. a
**Low** pass filter allows low frequencies through and cuts high frequencies)
are the most common and arguably the most useful of filters.  You'd struggle to
find a single subtractive synth sound that doesn't integrate at least one of
these, and 9 times out of 10 that's going to be a _Low Pass filter_.

* Low Pass: _allows low frequencies through, cuts highs, makes your sound darker_
* High pass: _allows high frequencies through, cuts lows, makes your sound
  brighter or thinner_
* Band Pass: _allows a narrow band of frequencies through, cutting both highs
  and lows, makes your sound narrower sounding, depending on how you use it_

Passing filters have two main parameters that matter, frequency, and resonance,
and most often, both are adjustable.

### Frequency (or Cutoff)

This is the frequency at which the filter takes effect.  For example, if your
filter is set to 1000hz...

* A low pass filter rolls off highs past 1000hz
* A band pass filter rolls off lows below and highs past 1000hz
* A high pass fitler rolls off lows below 1000hz

![low pass filter at 1000hz](/img/synth-school/in-under-a-minute/basic-subtractive-synth/low-pass-filter.png#center)

### Resonance (or Q)

This is a control that changes the shape of the filter, both how steeply it
changes your sound, as well as adding a _resonant peak_ at the point of the
filter cutoff.

A low pass filter with a high Q would look like this if you graphed its
frequency spectrum.  As a filters resonance goes up, the relative frequency
content changes in favor emphasizing the cut off point of the filter.

At higher Q levels, a filter can even become self resonant, adding the frequency
of the filter itself to the output sound as a squelchy or whistling sound.  

At moderate Q levels, the resonance control can help a low pass filter sound
more defined, a band pass filter sound more like a wah effect, and a high pass
filter sound fatter.

![low pass filter with high q at 1000hz](/img/synth-school/in-under-a-minute/basic-subtractive-synth/low-pass-filter-high-q.png#center)

### Filter Envelope (ADSR)

Filters have envelopes as well, and this works the same as the amp envelope,
with the same four parameters, plus one new one: Env amount.  So where an amp
envelope (generally) has a well defined start and end, that is no sound to
maximum sound, since the filter has a set-point, we can tell it to either
increase or decrease the filter frequency from the filter envelope, and by how
much.

![filter env amount knob](/img/synth-school/in-under-a-minute/basic-subtractive-synth/filter-env-amount-knob.jpg#center)

In general, the increase side of this will sound more "natural", (especially
with a low pass filter).

## Putting it all together

So, putting everything together, to start programming your subtractive synth:

1. Start with a base waveform that sounds like what you want
2. Set your sound's general volume character with the amp envelope
3. Change the timbre of your sound with a filter
4. Adjust the filter's envelope to taste
5. Repeat #2-4 until you've got the sound you want
6. Play music

But most of all, make some noise and have fun!