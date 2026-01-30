/**
 * Compresses an image file using HTML Canvas
 * @param file The original File object
 * @param maxWidth Maximum width (default 1920)
 * @param maxHeight Maximum height (default 1080)
 * @param quality Quality from 0 to 1 (default 0.8)
 * @returns Promise resolving to a compressed Blob
 */
export async function compressImage(
    file: File,
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions maintaining aspect ratio
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height *= maxWidth / width));
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width *= maxHeight / height));
                        height = maxHeight;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Could not get canvas context'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                // Determine format based on original file type or default to jpeg for better compression
                const format = file.type === 'image/png' ? 'image/jpeg' : file.type;

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error('Compression failed'));
                        }
                    },
                    format,
                    quality
                );
            };

            img.onerror = (error) => reject(error);
        };

        reader.onerror = (error) => reject(error);
    });
}

/**
 * Helper to compress a File and return a new File object
 */
export async function compressImageFile(file: File): Promise<File> {
    try {
        // Skip small files (under 500KB)
        if (file.size < 500 * 1024) return file;

        const blob = await compressImage(file);
        return new File([blob], file.name, {
            type: blob.type,
            lastModified: Date.now(),
        });
    } catch (error) {
        console.error('Compression error:', error);
        return file; // Return original on error
    }
}
