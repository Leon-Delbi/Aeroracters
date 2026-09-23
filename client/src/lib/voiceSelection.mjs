export const VOICE_ENGINE_ESPEAK = 'espeak';
export const VOICE_ENGINE_SAM = 'sam';
export const VOICE_ENGINE_BOTH = 'both';

export function normalizeVoiceSelection(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'sam' || normalized === 'samtts') {
        return VOICE_ENGINE_SAM;
    }
    if (
        normalized === 'both' ||
        normalized === 'combined' ||
        normalized === 'default' ||
        normalized === 'standard' ||
        normalized === 'espeakandsam' ||
        normalized === 'espeak+sam'
    ) {
        return VOICE_ENGINE_BOTH;
    }
    return VOICE_ENGINE_ESPEAK;
}

export function getVoiceLabel(value) {
    const normalized = normalizeVoiceSelection(value);
    if (normalized === VOICE_ENGINE_SAM) return 'SAM';
    if (normalized === VOICE_ENGINE_BOTH) return 'espeak + SAM';
    return 'espeak';
}
