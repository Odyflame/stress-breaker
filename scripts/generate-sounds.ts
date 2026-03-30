import fs from 'fs';
import path from 'path';

// Helper to generate simple synthetic hit sounds using standard WAV format
function generateWav(frequency: number, durationMs: number, type: 'noise' | 'sine' | 'square'): Buffer {
    const sampleRate = 44100;
    const numChannels = 1;
    const bitsPerSample = 16;
    const numSamples = Math.floor((sampleRate * durationMs) / 1000);
    const dataSize = numSamples * numChannels * (bitsPerSample / 8);
    const fileSize = 36 + dataSize;

    const buffer = Buffer.alloc(fileSize + 8);

    // RIFF header
    buffer.write('RIFF', 0);
    buffer.writeUInt32LE(fileSize, 4);
    buffer.write('WAVE', 8);

    // fmt subchunk
    buffer.write('fmt ', 12);
    buffer.writeUInt32LE(16, 16); // Subchunk1Size
    buffer.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
    buffer.writeUInt16LE(numChannels, 22);
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28); // ByteRate
    buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), 32); // BlockAlign
    buffer.writeUInt16LE(bitsPerSample, 34);

    // data subchunk
    buffer.write('data', 36);
    buffer.writeUInt32LE(dataSize, 40);

    // Audio data
    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let sample = 0;

        // Envelope to make it sound like a hit (fast attack, exponential decay)
        const envelope = Math.exp(-t * 15);

        switch (type) {
            case 'noise':
                sample = (Math.random() * 2 - 1);
                break;
            case 'sine':
                // Frequency sweep down for impact feel
                const sweepFreq = frequency * Math.exp(-t * 20);
                sample = Math.sin(2 * Math.PI * sweepFreq * t);
                break;
            case 'square':
                const sqFreq = frequency * Math.exp(-t * 10);
                sample = Math.sin(2 * Math.PI * sqFreq * t) > 0 ? 1 : -1;
                break;
        }

        // Apply envelope and scale to 16-bit
        const value = Math.floor(sample * envelope * 32767 * 0.5);
        buffer.writeInt16LE(value, 44 + i * 2);
    }

    return buffer;
}

const assetsDir = path.join(process.cwd(), 'src', 'assets', 'sounds');
if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
}

// 1. Mouse: High-pitched click
fs.writeFileSync(path.join(assetsDir, 'hit_mouse.wav'), generateWav(1200, 100, 'square'));
// 2. Keyboard: Clack sound
fs.writeFileSync(path.join(assetsDir, 'hit_keyboard.wav'), generateWav(800, 150, 'noise'));
// 3. Monitor: Glass shattered / heavy thud
fs.writeFileSync(path.join(assetsDir, 'hit_monitor.wav'), generateWav(300, 300, 'noise'));
// 4. MacBook: Metallic crunch
fs.writeFileSync(path.join(assetsDir, 'hit_macbook.wav'), generateWav(400, 250, 'square'));
// 5. Office Chair: Heavy thump
fs.writeFileSync(path.join(assetsDir, 'hit_chair.wav'), generateWav(150, 400, 'sine'));
// 6. Smartphone: High pitched glass shatter
fs.writeFileSync(path.join(assetsDir, 'hit_smartphone.wav'), generateWav(2000, 200, 'noise'));

console.log('Generated sound files successfully in src/assets/sounds/');
