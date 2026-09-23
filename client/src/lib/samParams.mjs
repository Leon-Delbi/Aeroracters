function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

const SAM_PITCH_DEFAULT = 64;
const SAM_SPEED_DEFAULT = 72;

export function normalizeSamPitch(pitch) {
  const value = Number.isFinite(Number(pitch)) ? Number(pitch) : 50;
  if (value === 50) {
    return SAM_PITCH_DEFAULT;
  }
  if (value >= 0 && value <= 255) {
    return clamp(Math.round(value), 0, 255);
  }
  return SAM_PITCH_DEFAULT;
}

export function normalizeSamSpeed(speed) {
  const value = Number.isFinite(Number(speed)) ? Number(speed) : 175;
  if (value === 175) {
    return SAM_SPEED_DEFAULT;
  }
  if (value >= 0 && value <= 255) {
    return clamp(Math.round(value), 0, 255);
  }
  return SAM_SPEED_DEFAULT;
}
