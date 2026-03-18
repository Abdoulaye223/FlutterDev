/**
 * File validation utilities with magic byte verification
 * Provides defense-in-depth against malicious file uploads
 */

// Magic byte signatures for common image formats
const IMAGE_MAGIC_BYTES: { [key: string]: string[] } = {
  'image/jpeg': ['ffd8ff'],
  'image/png': ['89504e47'],
  'image/gif': ['47494638'],
  'image/webp': ['52494646'],
};

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates image file by checking magic bytes (file signature)
 * This provides server-side-like validation on the client to prevent
 * uploading disguised files with image extensions
 */
export const validateImageMagicBytes = async (file: File): Promise<boolean> => {
  try {
    const buffer = await file.slice(0, 12).arrayBuffer();
    const arr = new Uint8Array(buffer);
    const header = Array.from(arr)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

    // Check if the file header matches any known image format
    return Object.values(IMAGE_MAGIC_BYTES).some((signatures) =>
      signatures.some((sig) => header.toLowerCase().startsWith(sig))
    );
  } catch {
    return false;
  }
};

/**
 * Validates file extension against allowed image extensions
 */
export const validateImageExtension = (fileName: string): boolean => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
};

/**
 * Validates file MIME type against allowed image types
 */
export const validateImageMimeType = (file: File): boolean => {
  return ALLOWED_IMAGE_TYPES.includes(file.type);
};

/**
 * Comprehensive image file validation
 * Checks MIME type, extension, and magic bytes
 */
export const validateImageFile = async (
  file: File,
  maxSizeBytes: number = 5 * 1024 * 1024
): Promise<FileValidationResult> => {
  // Check file size first (fast check)
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File "${file.name}" exceeds maximum size of ${Math.round(maxSizeBytes / 1024 / 1024)}MB`,
    };
  }

  // Check MIME type
  if (!validateImageMimeType(file)) {
    return {
      valid: false,
      error: `File "${file.name}" has invalid type. Allowed: JPEG, PNG, GIF, WebP`,
    };
  }

  // Check file extension
  if (!validateImageExtension(file.name)) {
    return {
      valid: false,
      error: `File "${file.name}" has invalid extension. Allowed: .jpg, .jpeg, .png, .gif, .webp`,
    };
  }

  // Validate magic bytes (actual file content)
  const hasMagicBytes = await validateImageMagicBytes(file);
  if (!hasMagicBytes) {
    return {
      valid: false,
      error: `File "${file.name}" appears to be invalid or corrupted`,
    };
  }

  return { valid: true };
};

/**
 * Validates multiple image files
 * Returns the first validation error if any, or success
 */
export const validateImageFiles = async (
  files: File[],
  maxSizeBytes: number = 5 * 1024 * 1024
): Promise<FileValidationResult> => {
  for (const file of files) {
    const result = await validateImageFile(file, maxSizeBytes);
    if (!result.valid) {
      return result;
    }
  }
  return { valid: true };
};
