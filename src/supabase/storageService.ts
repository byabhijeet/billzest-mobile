import { supabase } from './supabaseClient';
import { AppError, toAppError } from '../utils/appError';

// Simple storage helper for uploading assets (e.g., product images, business logo)
// Expects a bucket named `assets` to exist in Supabase Storage with public read or signed URL policy.
const BUCKET = 'assets';

export type UploadOptions = {
  contentType?: string;
  cacheControl?: string;
  upsert?: boolean;
};

export const storageService = {
  async uploadPublicFile(path: string, file: Blob | ArrayBuffer, options: UploadOptions = {}) {
    try {
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: options.contentType,
        cacheControl: options.cacheControl ?? '3600',
        upsert: options.upsert ?? true,
      });

      if (error) {
        throw toAppError('storage.upload', error, 'Unable to upload file.');
      }

      const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      if (!publicUrlData?.publicUrl) {
        throw new AppError('server', 'Upload succeeded but no public URL returned.');
      }
      return publicUrlData.publicUrl;
    } catch (err) {
      throw toAppError('storage.upload', err, 'Unable to upload file.');
    }
  },

  async deleteFile(path: string) {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) {
      throw toAppError('storage.delete', error, 'Unable to delete file.');
    }
  },
};
