import { supabase } from './supabase';

/**
 * Uploads a file to Supabase storage and returns the public URL
 * @param file The file to upload
 * @param bucket The storage bucket name (default: 'uploads')
 * @returns The public URL of the uploaded image
 */
export async function uploadImage(file: File, bucket: string = 'uploads') {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return data.publicUrl;
}
