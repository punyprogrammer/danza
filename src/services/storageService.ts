// Firebase Storage service for media uploads
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

export interface UploadResult {
  url: string;
  path: string;
  size: number;
  type: string;
}

class StorageService {
  /**
   * Check if Firebase Storage is properly initialized
   */
  private checkStorageInitialization() {
    console.log('🔍 Checking Firebase Storage initialization...');
    console.log('Storage object:', storage);
    console.log('Storage type:', typeof storage);
    console.log('Storage is null:', storage === null);
    console.log('Storage is undefined:', storage === undefined);
    
    if (!storage || storage === null || typeof storage === 'undefined') {
      console.error('❌ Firebase Storage is not initialized.');
      console.error('Storage object:', storage);
      console.error('Storage type:', typeof storage);
      throw new Error('Firebase Storage is not initialized. Please check your Firebase configuration.');
    }
    
    console.log('✅ Firebase Storage is properly initialized');
  }

  /**
   * Upload a file to Firebase Storage
   * @param file - File to upload
   * @param path - Storage path
   * @param onProgress - Progress callback
   * @returns Promise<UploadResult>
   */
  async uploadFile(
    file: any,
    path: string,
    onProgress?: (progress: number) => void
  ): Promise<UploadResult> {
    try {
      this.checkStorageInitialization();

      console.log('🔄 Starting file upload...');
      console.log('File:', file);
      console.log('Path:', path);
      console.log('Storage instance:', storage);

      const storageRef = ref(storage, path);
      console.log('✅ Storage reference created:', storageRef.fullPath);
      
      // Convert file to blob if it's a URI
      let blob;
      if (file.uri) {
        console.log('📁 Converting URI to blob...');
        const response = await fetch(file.uri);
        if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
        }
        blob = await response.blob();
        console.log('✅ File converted to blob, size:', blob.size);
      } else {
        console.log('📁 Using file as blob...');
        blob = file;
      }

      // Validate file size
      if (blob.size === 0) {
        throw new Error('File is empty or corrupted');
      }

      console.log('🚀 Uploading to Firebase Storage...');
      console.log('Blob size:', blob.size);
      console.log('Blob type:', blob.type);

      // Upload file
      const uploadTask = await uploadBytes(storageRef, blob);
      console.log('✅ File uploaded successfully:', uploadTask.ref.fullPath);
      console.log('Upload metadata:', uploadTask.metadata);
      
      // Get download URL
      const downloadURL = await getDownloadURL(uploadTask.ref);
      console.log('✅ Download URL generated:', downloadURL);

      const result: UploadResult = {
        url: downloadURL,
        path: uploadTask.ref.fullPath,
        size: uploadTask.metadata.size,
        type: uploadTask.metadata.contentType || 'unknown',
      };

      console.log('✅ Upload result:', result);
      return result;
    } catch (error: any) {
      console.error('❌ Error uploading file:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      console.error('Error details:', error);
      
      // Provide more specific error messages
      if (error.code === 'storage/unknown') {
        throw new Error('Storage upload failed: Unknown error. Please check your Firebase Storage configuration and permissions.');
      } else if (error.code === 'storage/unauthorized') {
        throw new Error('Storage upload failed: Unauthorized. Please check your Firebase Storage rules.');
      } else if (error.code === 'storage/quota-exceeded') {
        throw new Error('Storage upload failed: Quota exceeded. Please check your Firebase Storage limits.');
      } else if (error.code === 'storage/object-not-found') {
        throw new Error('Storage upload failed: Object not found. Please check the file path.');
      } else if (error.code === 'storage/bucket-not-found') {
        throw new Error('Storage upload failed: Bucket not found. Please check your Firebase Storage configuration.');
      } else if (error.code === 'storage/project-not-found') {
        throw new Error('Storage upload failed: Project not found. Please check your Firebase project configuration.');
      } else if (error.code === 'storage/retry-limit-exceeded') {
        throw new Error('Storage upload failed: Retry limit exceeded. Please try again later.');
      } else {
        throw new Error(`Storage upload failed: ${error.message || 'Unknown error'}`);
      }
    }
  }

  /**
   * Upload multiple files
   * @param files - Array of files to upload
   * @param basePath - Base storage path
   * @param onProgress - Progress callback for each file
   * @returns Promise<UploadResult[]>
   */
  async uploadMultipleFiles(
    files: any[],
    basePath: string,
    onProgress?: (fileIndex: number, progress: number) => void
  ): Promise<UploadResult[]> {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileName = `file_${Date.now()}_${index}`;
        const filePath = `${basePath}/${fileName}`;
        
        return this.uploadFile(file, filePath, (progress) => {
          onProgress?.(index, progress);
        });
      });

      const results = await Promise.all(uploadPromises);
      console.log('✅ Multiple files uploaded successfully');
      return results;
    } catch (error) {
      console.error('❌ Error uploading multiple files:', error);
      throw error;
    }
  }

  /**
   * Delete a file from Firebase Storage
   * @param path - Storage path of file to delete
   * @returns Promise<void>
   */
  async deleteFile(path: string): Promise<void> {
    try {
      this.checkStorageInitialization();

      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
      console.log('✅ File deleted successfully:', path);
    } catch (error) {
      console.error('❌ Error deleting file:', error);
      throw error;
    }
  }

  /**
   * Generate storage path for user media
   * @param userId - User ID
   * @param mediaType - Type of media (profile, photos, videos)
   * @param fileName - File name
   * @returns Storage path
   */
  generateUserMediaPath(userId: string, mediaType: 'profile' | 'photos' | 'videos', fileName?: string): string {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = fileName ? fileName.split('.').pop() : 'jpg';
    const finalFileName = fileName || `${mediaType}_${timestamp}_${randomId}.${fileExtension}`;
    
    return `users/${userId}/${mediaType}/${finalFileName}`;
  }

  /**
   * Validate file size
   * @param file - File to validate
   * @param maxSizeMB - Maximum size in MB
   * @returns boolean
   */
  validateFileSize(file: any, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    const fileSize = file.size || file.fileSize || 0;
    return fileSize <= maxSizeBytes;
  }

  /**
   * Validate file type
   * @param file - File to validate
   * @param allowedTypes - Array of allowed MIME types
   * @returns boolean
   */
  validateFileType(file: any, allowedTypes: string[]): boolean {
    const fileType = file.type || file.mimeType || '';
    return allowedTypes.includes(fileType);
  }
}

export const storageService = new StorageService();
